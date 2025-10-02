'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { gsap } from 'gsap';
import { useAppSelector } from '@/redux/store';
import {
  computeTotal,
  selectStatistics,
  selectTotalStatistics,
} from '@/redux/slices/statisticsSlice';
import { useDispatch } from 'react-redux';

type Timeframe = 'allTime' | 'month';
type Row = {
  platform: 'linkedin' | 'twitter' | 'threads' | 'Insta' | 'official';
  value: number;
};

const toInt = (v?: string | null) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

export default function SocialUsageChart() {
  const dispatch = useDispatch();

  const stats = useAppSelector(selectStatistics);

  const total = useAppSelector(selectTotalStatistics);

  useEffect(() => {
    if (stats.data) dispatch(computeTotal());
  }, [stats.data, dispatch]);

  const counts = useMemo(
    () => ({
      linkedin: toInt(stats.data?.linkedin),
      twitter: toInt(stats.data?.twitter),
      threads: toInt(stats.data?.threads),
      official: toInt(stats.data?.official),
    }),
    [stats.data]
  );

  const totalNum = useMemo(() => {
    const t = toInt(total);
    // fallback to recompute if slice total wasn't set yet
    return t > 0
      ? t
      : counts.linkedin + counts.twitter + counts.threads + counts.official;
  }, [total, counts]);

  const allTimePercentData: Row[] = useMemo(() => {
    const t = totalNum;
    if (t === 0) {
      return [
        { platform: 'linkedin', value: 0 },
        { platform: 'twitter', value: 0 },
        { platform: 'threads', value: 0 },
        { platform: 'official', value: 0 },
      ];
    }
    const pct = (n: number) => Math.round((n / t) * 100);
    return [
      { platform: 'linkedin', value: pct(counts.linkedin) },
      { platform: 'twitter', value: pct(counts.twitter) },
      { platform: 'threads', value: pct(counts.threads) },
      { platform: 'official', value: pct(counts.official) },
    ];
  }, [counts, totalNum]);

  const MOCK: Record<Timeframe, Row[]> = useMemo(
    () => ({
      allTime: allTimePercentData,
      month: [
        { platform: 'linkedin', value: 92 },
        { platform: 'twitter', value: 47 },
        { platform: 'threads', value: 34 },
        { platform: 'official', value: 28 },
      ],
    }),
    [allTimePercentData]
  );

  const [timeframe, setTimeframe] = useState<Timeframe>('allTime');
  const data = useMemo(() => MOCK[timeframe], [MOCK, timeframe]);

  const chartRef = useRef<HTMLDivElement | null>(null);


  // Animate bars + line on dataset change
  useEffect(() => {
    if (!chartRef.current) return;

    const rects = chartRef.current.querySelectorAll<SVGRectElement>(
      'rect.recharts-rectangle'
    );
    const linePath = chartRef.current.querySelector<SVGPathElement>(
      'path.recharts-line-curve'
    );

    // Bars: grow from bottom (scaleY) and fade in
    gsap.set(rects, {
      transformOrigin: 'center bottom',
      scaleY: 0.1,
      opacity: 0.2,
    });
    gsap.to(rects, {
      scaleY: 1,
      opacity: 1,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.05,
    });

    // Line: draw from 0 length
    if (linePath) {
      const length = linePath.getTotalLength();
      gsap.set(linePath, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
      gsap.to(linePath, {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay: 0.05,
      });
    }
  }, [timeframe]);

  return (
    <div className="w-full rounded-xl border border-white/10 bg-card/20 p-4 md:p-6">
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-sm">Platform usage%, Total across platforms = {total}</h3>
        <div className="ml-auto inline-flex rounded-lg border border-white/10 p-1">
          <button
            onClick={() => setTimeframe('allTime')}
            className={`px-3 py-1 text-xs md:text-sm rounded-md transition-colors
              ${
                timeframe === 'allTime'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
          >
            All Time
          </button>
          <button
            onClick={() => setTimeframe('month')}
            disabled
            className={`px-3 py-1 text-xs md:text-sm rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50
              ${
                timeframe === 'month'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
          >
            Past month
          </button>
        </div>
      </div>

      <div ref={chartRef} className="h-[230px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 16, bottom: 8, left: 8 }}
          >
            <defs>
              {/* bar gradient using your brand base #85d5f6 */}
              <linearGradient id="barFillV" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#85d5f6" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#85d5f6" stopOpacity={0.9} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="currentColor"
              className="text-white/10"
              vertical={false}
            />
            <XAxis
              dataKey="platform"
              tick={{ fill: 'currentColor' }}
              className="text-white/80 text-xs md:text-sm"
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fill: 'currentColor' }}
              className="text-white/70"
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.06)' }}
              contentStyle={{
                background: 'rgba(17,17,17,0.92)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#85d5f6' }}
              formatter={(v: number) => [`${v}%`, 'Usage']}
            />

            {/* Slim bars */}
            <Bar
              dataKey="value"
              fill="url(#barFillV)"
              barSize={12} // slimmer bars
              radius={[6, 6, 0, 0]} // rounded tops
              isAnimationActive={false} // GSAP handles animation
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
