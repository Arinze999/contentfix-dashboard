'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ModalContainer from '../ModalContainer';
import type { PostItem } from '@/types/social';
import { useAppSelector } from '@/redux/store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyOutline } from '@/components/icons/CopyOutline';

// helper to rebuild a single markdown payload from a PostItem
const buildMarkdownFromPost = (p: PostItem | null): string => {
  if (!p) return '';

  const sections: string[] = [];

  if (p.linkedin) {
    const header = p.linkedin.header ? `**Header:** ${p.linkedin.header}\n\n` : '';
    const body =
      p.linkedin.body?.markdown ??
      p.linkedin.body?.plain ??
      '';
    const tags = p.linkedin.hashtags?.length
      ? `\n\n#Hashtags: ${p.linkedin.hashtags.map(t => `#${t}`).join(' ')}`
      : '';
    sections.push(`# LinkedIn\n${header}${body}${tags}`);
  }

  if (p.twitter) {
    const text = p.twitter.text?.markdown ?? p.twitter.text?.plain ?? '';
    sections.push(`# Twitter/X\n${text}`);
  }

  if (p.threads) {
    const text = p.threads.text?.markdown ?? p.threads.text?.plain ?? '';
    sections.push(`# Threads\n${text}`);
  }

  if (p.official) {
    const subject = p.official.subject ? `Subject: ${p.official.subject}\n\n` : '';
    const body =
      p.official.body?.markdown ??
      p.official.body?.plain ??
      '';
    sections.push(`# Official\n${subject}${body}`);
  }

  return sections.filter(Boolean).join(`\n\n---\n\n`);
};

const HistoryModal = ({ id }: { id: string }) => {
  const posts = useAppSelector((state) => state.posts);
  const [post, setPost] = useState<PostItem | null>(null);

  // locate the post by id whenever posts or id change
  useEffect(() => {
    setPost(posts.find((p) => p.id === id) ?? null);
  }, [id, posts]);

  // copy-to-clipboard UI state
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const content = useMemo(() => buildMarkdownFromPost(post), [post]);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = content;
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

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  return (
    <ModalContainer padding="1rem" maxwidth="700px">
      {!post ? (
        <div className="text-sm text-white/70">Post not found.</div>
      ) : (
        <div className="text-sm rounded-lg flow-root relative">
          {/* Copy button */}
          <div className="sticky top-0 right-5 md:right-30 z-10 mt-2 mb-2 flex justify-end">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!content}
              className="rounded-md border border-white/20 px-3 py-1 text-xs md:text-sm shadow-sm hover:bg-white/10 disabled:opacity-50 flex-center gap-3"
              title="Copy content"
            >
              <CopyOutline /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Markdown */}
          <div className="block w-full break-words whitespace-pre-wrap leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: (props) => <p className="m-0" {...props} />,
                h1: (props) => (
                  <h1
                    className="text-3xl font-extrabold leading-tight mt-2 mb-2"
                    {...props}
                  />
                ),
                h2: (props) => (
                  <h2
                    className="text-3xl font-extrabold leading-tight mt-2 mb-2"
                    {...props}
                  />
                ),
                h3: (props) => (
                  <h3
                    className="text-3xl font-extrabold leading-tight mt-2 mb-2"
                    {...props}
                  />
                ),
                li: (props) => <li className="" {...props} />,
                code: ({ inlist, className, children, ...props }) =>
                  inlist ? (
                    <code className="px-1 py-0.5 rounded bg-white/10" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="p-3 rounded bg-white/5 overflow-x-auto mb-3">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </ModalContainer>
  );
};

export default HistoryModal;
