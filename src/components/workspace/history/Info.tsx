'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildMarkdownFromPost } from '@/components/modals/modalcontents/HistoryModal';
import { useAppSelector } from '@/redux/store';
import { PostItem } from '@/types/social';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyOutline } from '@/components/icons/CopyOutline';
import { useDeletePost } from '@/hooks/user/posts/useDeletePost';
import { LoadingTwotoneLoop } from '@/components/icons/LoadingLoop';
import { Delete12Filled } from '@/components/icons/DeleteIcon';

const Info = ({ id, isMobile }: { id: string; isMobile: boolean }) => {
  const posts = useAppSelector((state) => state.posts);
  const [post, setPost] = useState<PostItem | null>(null);

  const { deletePost, loading } = useDeletePost();

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

  if (isMobile) return;

  return (
    <div className="p-3 md:p-4 rounded-xl bg-blue-400/10 text-purple-100 flex-1 h-fit sticky top-25">
      {!post ? (
        <div className="text-sm text-white/70">Post not found.</div>
      ) : (
        <div className="text-sm rounded-lg flow-root">
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

          {/* Delete button */}
          <div className="sticky top-0 right-5 md:right-30 z-10 mt-2 mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => deletePost(post.id!)}
              disabled={!content || loading}
              className="rounded-md border-2 border-red-600 px-3 py-1 text-xs md:text-sm shadow-sm text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50 flex-center gap-3"
              title="Delete Post"
            >
              {loading ? <LoadingTwotoneLoop /> : <Delete12Filled />}
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
                    <code
                      className="px-1 py-0.5 rounded bg-white/10"
                      {...props}
                    >
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
    </div>
  );
};

export default Info;
