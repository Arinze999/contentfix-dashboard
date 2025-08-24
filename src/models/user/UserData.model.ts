// ── Submodels ────────────────────────────────────────────────────────────────
export type UserPosts = {
  threads: string[];
  twitter: string[];
  linkedin: string[];
  official: string[];
};

export const initialUserPosts: UserPosts = {
  threads: [],
  twitter: [],
  linkedin: [],
  official: [],
};

export type UserRating = {
  info: string;
  level: number;
};

export const initialUserRating: UserRating = {
  info: '',
  level: 0,
};

export type UserFeedback = {
  note: string;
};

export const initialUserFeedback: UserFeedback = {
  note: '',
};

// ── Root model ───────────────────────────────────────────────────────────────
export type UserData = {
  id: string | null;
  username: string | null;
  avatar_url: string | null;
  updated_at: string | null;            
  credits: string | null;               
  posts: UserPosts;
  posts_updated_at: string | null;      
  rating: UserRating;
  rating_updated_at: string | null;     
  feedback: UserFeedback;
  feedback_updated_at: string | null;
};

export const initialUserData: UserData = {
  id: null,
  username: null,
  avatar_url: null,
  updated_at: null,
  credits: null,
  posts: initialUserPosts,
  posts_updated_at: null,
  rating: initialUserRating,
  rating_updated_at: null,
  feedback: initialUserFeedback,
  feedback_updated_at: null,
};
