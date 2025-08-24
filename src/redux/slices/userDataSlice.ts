// store/userDataSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  UserData,
  initialUserData,
  UserPosts,
  UserRating,
  UserFeedback,
} from '@/models/user/UserData.model';

// If you commonly upsert partials:
type UserDataPartial = Partial<UserData>;

const userDataSlice = createSlice({
  name: 'userData',
  initialState: initialUserData,
  reducers: {
    // Replace whole object
    setUserData: (_state, action: PayloadAction<UserData>) => action.payload,

    // Merge partial updates (top-level only; nested objects must be sent entirely or use specific reducers below)
    patchUserData: (state, action: PayloadAction<UserDataPartial>) => {
      Object.assign(state, action.payload);
    },

    // Clear
    clearUserData: () => initialUserData,

    // ---- Focused setters for primitive top-level fields ----
    setUsername: (state, action: PayloadAction<string | null>) => {
      state.username = action.payload;
    },
    setAvatarUrl: (state, action: PayloadAction<string | null>) => {
      state.avatar_url = action.payload;
    },
    setUpdatedAt: (state, action: PayloadAction<string | null>) => {
      state.updated_at = action.payload;
    },
    setCredits: (state, action: PayloadAction<string | null>) => {
      state.credits = action.payload;
    },
    setPostsUpdatedAt: (state, action: PayloadAction<string | null>) => {
      state.posts_updated_at = action.payload;
    },
    setRatingUpdatedAt: (state, action: PayloadAction<string | null>) => {
      state.rating_updated_at = action.payload;
    },
    setFeedbackUpdatedAt: (state, action: PayloadAction<string | null>) => {
      state.feedback_updated_at = action.payload;
    },

    // ---- Nested: posts ----
    setPosts: (state, action: PayloadAction<UserPosts>) => {
      state.posts = action.payload;
    },
    patchPosts: (state, action: PayloadAction<Partial<UserPosts>>) => {
      state.posts = { ...state.posts, ...action.payload };
    },
    setPostsThreads: (state, action: PayloadAction<string[]>) => {
      state.posts.threads = action.payload;
    },
    setPostsTwitter: (state, action: PayloadAction<string[]>) => {
      state.posts.twitter = action.payload;
    },
    setPostsLinkedin: (state, action: PayloadAction<string[]>) => {
      state.posts.linkedin = action.payload;
    },
    setPostsOfficial: (state, action: PayloadAction<string[]>) => {
      state.posts.official = action.payload;
    },

    // ---- Nested: rating ----
    setRating: (state, action: PayloadAction<UserRating>) => {
      state.rating = action.payload;
    },
    patchRating: (state, action: PayloadAction<Partial<UserRating>>) => {
      state.rating = { ...state.rating, ...action.payload };
    },
    setRatingInfo: (state, action: PayloadAction<string>) => {
      state.rating.info = action.payload;
    },
    setRatingLevel: (state, action: PayloadAction<number>) => {
      state.rating.level = action.payload;
    },

    // ---- Nested: feedback ----
    setFeedback: (state, action: PayloadAction<UserFeedback>) => {
      state.feedback = action.payload;
    },
    patchFeedback: (state, action: PayloadAction<Partial<UserFeedback>>) => {
      state.feedback = { ...state.feedback, ...action.payload };
    },
    setFeedbackNote: (state, action: PayloadAction<string>) => {
      state.feedback.note = action.payload;
    },
  },
});

export const {
  setUserData,
  patchUserData,
  clearUserData,

  setUsername,
  setAvatarUrl,
  setUpdatedAt,
  setCredits,
  setPostsUpdatedAt,
  setRatingUpdatedAt,
  setFeedbackUpdatedAt,

  setPosts,
  patchPosts,
  setPostsThreads,
  setPostsTwitter,
  setPostsLinkedin,
  setPostsOfficial,

  setRating,
  patchRating,
  setRatingInfo,
  setRatingLevel,

  setFeedback,
  patchFeedback,
  setFeedbackNote,
} = userDataSlice.actions;

export default userDataSlice.reducer;
