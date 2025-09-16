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