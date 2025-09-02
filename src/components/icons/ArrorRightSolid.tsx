import { SVGProps } from 'react';

export function ArrowRightSolid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      >
        <path d="M18 12H5"></path>
        <path strokeLinejoin="round" d="m15 16l4-4l-4-4"></path>
      </g>
    </svg>
  );
}
