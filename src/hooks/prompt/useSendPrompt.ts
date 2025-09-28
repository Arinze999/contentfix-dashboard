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

export function useSendPrompt() {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const personas = useAppSelector((s) => s.personas);

  const activePersonaDesc = useMemo(() => {
    if (!personas) return '';
    if (personas.persona1?.default)
      return personas.persona1.description?.trim() ?? '';
    if (personas.persona2?.default)
      return personas.persona2.description?.trim() ?? '';
    return '';
  }, [personas]);

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
        // 'Start each section with "### <Platform>". Then put the post on the next line.',
        'If an Audience Persona is provided, tailor word choice, examples, and emphasis to that persona while preserving the user intent.',
        'Follow the Output Rules for section headers and layout.',
        'Respect platform norms: LinkedIn (professional by default and clearly identify the header for the post and the body as well), Twitter/X (≤280 chars), Threads (casual), Official (formal memo/email style).'
      );

      // Message (required by schema)
      if (v.message?.trim()) {
        lines.push('', '### User Idea', v.message.trim());
      }

      // Platforms (derive from booleans in the model)
      const platforms: string[] = [];
      if (v.linkedin) platforms.push('LinkedIn');
      if (v.twitter) platforms.push('Twitter/X');
      if (v.threads) platforms.push('Threads');
      if (v.official) platforms.push('Official');
      if (platforms.length) {
        lines.push('', '### Platforms', platforms.join(', '));
      }

      // Tones (optional array; if present, include)
      if (Array.isArray(v.tones) && v.tones.length > 0) {
        // If you want to cap at 2, uncomment: const tones = v.tones.slice(0, 2);
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
        // per-platform targets
        const targets: string[] = [];
        const li: string[] = [];
        const off: string[] = [];

        // line rules (your existing intent)
        const lineRule =
          v.length === 'short'
            ? 'Keep to ~1–2 lines.'
            : v.length === 'average'
            ? 'Keep to ~3–5 lines.'
            : 'Allow ~6–10 lines.';

        // word-count ranges per platform & length
        // Tune these if you want more/less verbosity.
        const ranges: any = {
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
            `- LinkedIn target: ${
              ranges.linkedin[v.length]
            } (use full sentences).`
          );
        }
        if (v.official) {
          targets.push('Official');
          off.push(
            `- Official target: ${
              ranges.official[v.length]
            } (use full sentences).`
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
   * NOTE: API key stays server-side in /api/send-prompt (uses DEEPSEEKR1_APIKEY).
   */
  const sendPrompt = useCallback(
    async (values: PromptDataType) => {
      // Basic guard: message is required by schema, but double-check here.
      if (!values.message?.trim()) {
        setFailed('Message cannot be empty.');
        setResult(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setFailed(null);
      setResult(null);

      // Abort any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const prompt = buildPrompt(values);

        const res = await fetch('/api/send-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `Request failed: ${res.status}`);
        }

        const data = (await res.json()) as SendResult;
        setResult({ content: data.content, id: data.id, model: data.model });
      } catch (err: any) {
        if (err?.name === 'AbortError') return; // quietly ignore
        setFailed(err?.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [buildPrompt]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setFailed(null);
    setResult(null);
    abortRef.current?.abort();
  }, []);

  return useMemo(
    () => ({ sendPrompt, loading, failed, result, reset }),
    [sendPrompt, loading, failed, result, reset]
  );
}
