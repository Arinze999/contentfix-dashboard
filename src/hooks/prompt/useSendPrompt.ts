'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { PromptDataType } from '@/models/chat/Chat.model';
import { EMOJI_LEVELS } from '@/models/chat/Chat.model';
import { useAppSelector } from '@/redux/store';

/**
 * Response shape returned by /api/send-prompt
 */
type SendResult = {
  content: string; // assistant Markdown
  id?: string;
  model?: string;
};

/* =========================
   Retry helpers (tunable)
   ========================= */
const MAX_RETRIES = 10; // total attempts (1 initial + up to 9 retries)
const BASE_DELAY_MS = 300; // starting backoff delay

/** Retry for network errors (no status) and 5xx responses. */
function shouldRetry(status?: number) {
  return status === undefined || (status >= 500 && status < 600);
}

/** Exponential backoff with jitter; capped ~2000ms per step. */
function backoffDelay(attempt: number) {
  // attempt is 1-based: 1,2,3...
  const exp = Math.min(2000, BASE_DELAY_MS * 2 ** (attempt - 1));
  const jitter = Math.floor(Math.random() * 100);
  return exp + jitter;
}

/** Sleep that is abort-safe (cleans up if AbortController aborts). */
function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted)
      return reject(new DOMException('Aborted', 'AbortError'));
    const id = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(id);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

export function useSendPrompt() {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);

  // One AbortController per request; reused in retries and cancelled by reset().
  const abortRef = useRef<AbortController | null>(null);

  const personas = useAppSelector((s) => s.personas);

  // Select active persona description (persona1 or persona2 that has default=true)
  const activePersonaDesc = useMemo(() => {
    if (!personas) return '';
    if (personas.persona1?.default)
      return personas.persona1.description?.trim() ?? '';
    if (personas.persona2?.default)
      return personas.persona2.description?.trim() ?? '';
    return '';
  }, [personas]);

  const LENGTHS = ['short', 'average', 'long'] as const;
  type LengthKey = (typeof LENGTHS)[number];

  function asLengthKey(x: unknown): LengthKey | null {
    return typeof x === 'string' && (LENGTHS as readonly string[]).includes(x)
      ? (x as LengthKey)
      : null;
  }

  /**
   * Build a single structured prompt from PromptDataType.
   * Only attaches sections that have values.
   */
  const buildPrompt = useCallback(
    (v: PromptDataType) => {
      const lines: string[] = [];

      // Base instruction to keep outputs consistent and easy to render
      lines.push(
        'You are ContentFix, an AI that rewrites text for selected platforms.',
        'Return only Markdown. For each selected platform, create a concise post.',
        'If an Audience Persona is provided, tailor word choice, examples, and emphasis to that persona while preserving the user intent.',
        'Follow the Output Rules for section headers and layout.',
        'Respect platform norms: LinkedIn (professional by default and clearly identify the header for the post and the body as well), Twitter/X (≤280 chars), Threads (casual), Official (formal memo/email style).'
      );

      // Message (required by schema)
      if (v.message?.trim()) {
        lines.push('', '### User Idea', v.message.trim());
      }

      // Platforms
      const platforms: string[] = [];
      if (v.linkedin) platforms.push('LinkedIn');
      if (v.twitter) platforms.push('Twitter/X');
      if (v.threads) platforms.push('Threads');
      if (v.official) platforms.push('Official');
      if (platforms.length) {
        lines.push('', '### Platforms', platforms.join(', '));
      }

      // Tones (optional)
      if (Array.isArray(v.tones) && v.tones.length > 0) {
        const tones = v.tones;
        lines.push('', '### Tones', tones.join(', '));
      }

      // Audience Persona (only if active persona exists)
      if (activePersonaDesc) {
        lines.push('', '### Audience Persona', activePersonaDesc);
      }

      // Emoji level (optional; validate via EMOJI_LEVELS)
      if (
        v.emojiLevel &&
        (EMOJI_LEVELS as readonly string[]).includes(v.emojiLevel)
      ) {
        const rule =
          v.emojiLevel === 'none'
            ? 'No emojis.'
            : v.emojiLevel === 'low'
            ? 'Few emojis, only when helpful.'
            : 'Some emojis allowed, stay tasteful.';
        lines.push('', '### Emoji Policy', rule);
      }

      // Input status focus
      if (v.inputStatus === 'idea') {
        lines.push(
          '',
          '### Task Focus',
          'Treat the user message as a raw idea. Create original copy for each selected platform.',
          'Open with a strong hook in the first body line. Add minimal connective context if needed.',
          'Do not ask questions or output notes—return only the posts.'
        );
      } else if (v.inputStatus === 'refinement') {
        lines.push(
          '',
          '### Task Focus',
          'Treat the user message as an existing draft. Preserve the original meaning, point of view, and any explicit facts, names, and numbers.',
          'Tighten wording, improve clarity and flow, and align to the selected tones without changing the core message.',
          'Do not introduce new claims or data. Return only the posts.'
        );
      }

      // Length preference (apply ONLY to LinkedIn and Official) with word-count targets
      if (v.length && (v.linkedin || v.official)) {
        const len = asLengthKey(v.length);

        if (len) {
          const targets: string[] = [];
          const li: string[] = [];
          const off: string[] = [];

          const lineRule =
            v.length === 'short'
              ? 'Keep to ~1–2 lines.'
              : v.length === 'average'
              ? 'Keep to ~3–5 lines.'
              : 'Allow ~6–10 lines.';

          const ranges = {
            linkedin: {
              short: '40–70 words',
              average: '80–120 words',
              long: '140–200 words',
            },
            official: {
              short: '60–100 words',
              average: '120–160 words',
              long: '180–260 words',
            },
          } as const;

          if (v.linkedin) {
            targets.push('LinkedIn');
            li.push(
              `- LinkedIn target: ${ranges.linkedin[len]} (use full sentences).`
            );
          }
          if (v.official) {
            targets.push('Official');
            off.push(
              `- Official target: ${ranges.official[len]} (use full sentences).`
            );
          }

          lines.push(
            '',
            '### Length Preference',
            `Apply only to ${targets.join(' and ')} posts: ${lineRule}`,
            'For these platforms, adhere to the following word-count ranges:',
            ...(li.length ? li : []),
            ...(off.length ? off : []),
            'Ignore any length targets for Twitter/X and Threads.'
          );
        }
      }

      if (v.linkedin) {
        lines.push(
          '',
          '### LinkedIn Formatting',
          'Begin the post with a bold headline line: **Header:** <short headline>.',
          'Place the headline and the body on two different lines — never on the same line.',
          v.length === 'long'
            ? 'Write 10–15 lines for the body, expanding ideas fully and using bold for 2–3 key phrases (e.g., **key point**).'
            : v.length === 'average'
            ? 'Write 6–10 lines for the body and bold 2–3 key phrases (e.g., **key point**).'
            : 'Write 4–5 short lines for the body and bold 2–3 key phrases (e.g., **key point**).',
          'End with a clear CTA or an end of speech mic drop moment (optional). Keep hashtags ≤ 3 (optional).'
        );
      }

      if (v.official) {
        lines.push(
          '',
          '### Official Formatting',
          'Start with a brief subject-style header line, then body on the next line.',
          'Use full sentences and clear structure; if length is "long", include a short rationale or bullet list of 2–3 items.'
        );
      }

      // Output rules
      lines.push(
        '',
        '### Output Rules',
        '- Start each section with exactly: "# LinkedIn" (or "# Twitter/X", "# Threads", "# Official") — plain text, one space after #, no bold.',
        '- Put one blank line after the heading.',
        '- After each platform section, output a horizontal rule on its own line as `---`, with a blank line before and after.',
        '- Do not include code fences.',
        '- Return only the posts in Markdown.',
        '- If a length preference is provided, apply it only to LinkedIn and Official; ignore for Twitter/X and Threads.',
        '- For LinkedIn and Official, the specified word-count ranges are hard requirements; do not summarize below the lower bound.',
        '- If input status is "refinement", preserve facts/names/numbers and avoid new claims; if "idea", you may add light connective context but no fabricated statistics.'
      );

      return lines.join('\n');
    },
    [activePersonaDesc]
  );

  /**
   * Send the assembled prompt to the server route that calls DeepSeek.
   * Adds robust retry with exponential backoff (10 attempts) for 5xx & network errors.
   * Respects AbortController across retries and delays.
   */
  const sendPrompt = useCallback(
    async (values: PromptDataType) => {
      // Guard: schema enforces message, but we double-check here.
      if (!values.message?.trim()) {
        setFailed('Message cannot be empty.');
        setResult(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setFailed(null);
      setResult(null);

      // Abort any in-flight request and create a fresh controller for this cycle.
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      try {
        const prompt = buildPrompt(values);
        let lastErr: unknown = null;

        // Attempts are 1..MAX_RETRIES
        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          if (signal.aborted) throw new DOMException('Aborted', 'AbortError');

          try {
            const res = await fetch('/api/send-prompt', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt }),
              signal,
            });

            if (!res.ok) {
              // Read body once for logging/message
              const text = await res.text().catch(() => '');

              // Retry only for 5xx
              if (shouldRetry(res.status)) {
                lastErr = new Error(text || `HTTP ${res.status}`);
                if (attempt < MAX_RETRIES) {
                  await sleep(backoffDelay(attempt), signal); // abort-safe wait
                  continue;
                }
                throw lastErr; // out of retries
              }

              // 4xx or other non-retryable statuses: fail fast
              throw new Error(text || `Request failed: ${res.status}`);
            }

            // Success
            const data = (await res.json()) as SendResult;
            setResult({
              content: data.content,
              id: data.id,
              model: data.model,
            });
            lastErr = null;
            break;
          } catch (err: any) {
            // Abort: stop immediately (do not setFailed)
            if (err?.name === 'AbortError') throw err;

            // Network errors (no status) are retryable
            lastErr = err;
            if (attempt < MAX_RETRIES && shouldRetry(undefined)) {
              await sleep(backoffDelay(attempt), signal); // abort-safe wait
              continue;
            }
            // Out of retries or non-retryable error surfaced above
            throw lastErr;
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return; // silent on cancel/reset
        setFailed(
          err?.message
            ? `${err.message} (after ${MAX_RETRIES} attempts)`
            : `Failed after ${MAX_RETRIES} attempts`
        );
      } finally {
        setLoading(false);
      }
    },
    [buildPrompt]
  );

  /** Cancel any in-flight work and reset state. */
  const reset = useCallback(() => {
    setLoading(false);
    setFailed(null);
    setResult(null);
    abortRef.current?.abort();
  }, []);

  // Stable return object to avoid re-renders.
  return useMemo(
    () => ({ sendPrompt, loading, failed, result, reset }),
    [sendPrompt, loading, failed, result, reset]
  );
}
