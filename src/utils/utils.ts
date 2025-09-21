export const calculateTimeAgo = (dateString: string | Date) => {
  const date = new Date(dateString); // Ensure it's a Date object
  if (isNaN(date.getTime())) {
    return 'N/A'; // Return if it's an invalid date
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime(); // Difference in milliseconds
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days

  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

// utils/compactId.ts
export function compact(
  value: string | number | null | undefined,
  opts?: {
    start?: number;   // how many chars to keep from the start
    end?: number;     // how many chars to keep from the end
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
