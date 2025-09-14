'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSendPromptContext } from '@/context/SendPromptContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ResultSkeleton from '../loaders/ResultSkeleton';
import { gsap } from '@/lib/gsapClient';
import { CopyOutline } from '../icons/CopyOutline';
import { Save } from '../icons/Save';

const ResultScreen: React.FC = () => {
  const { loading, result, failed } = useSendPromptContext();

  // container for markdown content that gets animated
  const containerRef = useRef<HTMLDivElement | null>(null);

  // copy-to-clipboard UI state (kept OUTSIDE the animated subtree)
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  // track if initial typing animation has completed
  const [hasAnimated, setHasAnimated] = useState(false);

  // reset animation flag whenever new content arrives
  useEffect(() => {
    setHasAnimated(false);
  }, [result?.id, result?.content]);

  // GSAP typing effect after markdown renders
  useEffect(() => {
    if (loading) return;
    const el = containerRef.current;
    if (!el || !result?.content) return;

    const ctx = gsap.context(() => {
      const blocks = el.querySelectorAll('h1, h2, h3, p, li');
      const tl = gsap.timeline({ defaults: { ease: 'none' } });

      blocks.forEach((node) => {
        const full = node.textContent ?? '';
        if (!full.trim()) return;
        gsap.set(node, { opacity: 1 });
        tl.fromTo(
          node,
          { text: '' as any },
          {
            text: full as any,
            duration: Math.min(2.2, Math.max(0.6, full.length / 35)),
          },
          '+=0.05'
        );
      });

      tl.eventCallback('onComplete', () => setHasAnimated(true));
    }, el);

    return () => {
      ctx.revert(); // clean inline styles & tweens
    };
  }, [loading, result?.id, result?.content]);

  // copy-to-clipboard handler
  const handleCopy = async () => {
    const text = result?.content ?? '';
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } finally {
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 4000);
    }
  };

  // clear copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // key to re-mount Markdown ONLY when result changes (not on "copied")
  const mdKey = result?.id ?? result?.content?.length ?? 0;

  // memoize the Markdown subtree so local UI updates don’t re-render it
  const markdown = useMemo(() => {
    if (!result?.content) return null;

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Only apply opacity-0 BEFORE the first animation
          p: (props) => (
            <p className={hasAnimated ? 'm-0' : 'm-0 opacity-0'} {...props} />
          ),
          h1: (props) => (
            <h1
              className={
                hasAnimated
                  ? 'text-3xl font-extrabold leading-tight mt-6 mb-3'
                  : 'text-3xl font-extrabold leading-tight mt-6 mb-3 opacity-0'
              }
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className={
                hasAnimated
                  ? 'text-3xl font-extrabold leading-tight mt-6 mb-3'
                  : 'text-3xl font-extrabold leading-tight mt-6 mb-3 opacity-0'
              }
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className={
                hasAnimated
                  ? 'text-3xl font-extrabold leading-tight mt-6 mb-3'
                  : 'text-3xl font-extrabold leading-tight mt-6 mb-3 opacity-0'
              }
              {...props}
            />
          ),
          li: (props) => (
            <li className={hasAnimated ? '' : 'opacity-0'} {...props} />
          ),
          hr: () => <hr className="my-6 border-t border-white/20" />,
        }}
      >
        {result.content}
      </ReactMarkdown>
    );
  }, [hasAnimated, result?.content]);

  return (
    <div className="text-sm rounded-lg flow-root relative">
      {/* Copy button (kept outside the animated containerRef subtree) */}
      {result?.content && !loading && !failed && (
        <div className="sticky top-0 right-5 md:right-30 z-10 mt-2 mb-2 flex justify-end">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!result?.content}
            className="rounded-md border border-white/20 px-3 hover:text-white py-1 text-xs md:text-sm shadow-sm hover:bg-white/10 bg-blue-700/50 disabled:opacity-50 flex-center gap-3"
            title="Copy content"
          >
            <CopyOutline /> {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}

      {/* Save button (kept outside the animated containerRef subtree) */}
      {result?.content && !loading && !failed && (
        <div className="sticky top-20 right-5 md:right-30 z-10 mt-2 mb-2 flex justify-end">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!result?.content}
            className="rounded-md border border-white/20 px-3 hover:text-white py-1 text-xs md:text-sm shadow-sm hover:bg-white/10 bg-purple-500/50 disabled:opacity-50 flex-center gap-3"
            title="Copy content"
          >
            <Save /> {copied ? 'Saved!' : 'Save'}
          </button>
        </div>
      )}

      {loading ? (
        <ResultSkeleton />
      ) : failed ? (
        <p className="text-red-400">
          Failed. Please retry shortly — DeepSeek servers are currently busy…
        </p>
      ) : (
        <div
          ref={containerRef}
          // keep the animated content isolated here
          className="block w-full break-words whitespace-pre-wrap leading-relaxed"
          key={mdKey}
        >
          {markdown}
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
