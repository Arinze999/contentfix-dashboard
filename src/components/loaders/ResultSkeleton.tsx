'use client';

import React from 'react';
import clsx from 'clsx';

type Props = {
  lines?: number; // how many lines to show
  className?: string; // extra wrapper classes
};

const WIDTHS = [
  'w-[95%]',
  'w-[88%]',
  'w-[92%]',
  'w-[62%]',
  'w-[85%]',
  'w-[40%]',
];

const ResultSkeleton: React.FC<Props> = ({ lines = 8, className }) => {
  return (
    <div role="status" aria-busy="true" className={clsx('', className)}>
      <div className="space-y-3">
        {/* Optional: a “heading” line */}
        <p className='mb-6 text-sm text-white/50'>Enhacing and turning your idea into posts......</p>
        <div className="relative h-4 w-56 overflow-hidden rounded bg-white/10">
          <div className="absolute inset-0 animate-[shimmer_1.6s_linear_infinite_alternate] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'relative overflow-hidden rounded bg-white/10',
              i % 5 === 0 ? 'h-2' : 'h-1', // vary height a bit
              WIDTHS[i % WIDTHS.length] // vary width
            )}
          >
            <div className="absolute inset-0 animate-[shimmer_1.6s_linear_infinite_alternate] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultSkeleton;
