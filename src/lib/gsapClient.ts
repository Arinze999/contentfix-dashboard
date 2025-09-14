'use client';

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Safe to call more than once; GSAP ignores duplicate registrations.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export { gsap, TextPlugin };
