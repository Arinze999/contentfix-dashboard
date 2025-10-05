export const calculateTimeAgo = (dateString: string | Date) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';

  // If it's in the future, clamp to "just now"
  let diffMs = Date.now() - date.getTime();
  if (diffMs < 0) diffMs = 0;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

  const weeks = Math.floor(days / 7);
  if (days < 30) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (days < 365) return `${months} month${months !== 1 ? 's' : ''} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
};

// utils/compactId.ts
export function compact(
  value: string | number | null | undefined,
  opts?: {
    start?: number; // how many chars to keep from the start
    end?: number; // how many chars to keep from the end
    ellipsis?: string; // replacement in the middle
  }
): string {
  const str = String(value ?? '');
  if (!str) return '';

  const start = Math.max(1, opts?.start ?? 6);
  const end = Math.max(1, opts?.end ?? 4);
  const ellipsis = opts?.ellipsis ?? '....';

  // If it's already short, don't expand it by adding ellipsis
  if (str.length <= start + end + ellipsis.length) return str;

  return `${str.slice(0, start)}${ellipsis}${str.slice(-end)}`;
}
