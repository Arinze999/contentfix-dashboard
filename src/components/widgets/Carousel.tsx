'use client';
import React, { useEffect, useMemo, useState } from 'react';

type CarouselProps = {
  items: Record<string, string>; // editable object of texts
  interval?: number; // ms between swaps (default 4000)
};

export default function Carousel({ items, interval = 4000 }: CarouselProps) {
  const slides = useMemo(() => Object.values(items), [items]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  if (!slides.length) return null;

  return (
    <div className="carousel">
      <div className="carousel-slide">
        <p className="carousel-text text-gray-300">{slides[index]}</p>
      </div>

      <div
        className="carousel-indicators"
        role="tablist"
        aria-label="Carousel indicators"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            className={`dot ${i === index ? 'dot--active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
