// store/userDataSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData, initialUserData } from '@/models/user/UserData.model';

// If you commonly upsert partials:
type UserDataPartial = Partial<UserData>;

const userDataSlice = createSlice({
  name: 'userData',
  initialState: initialUserData,
  reducers: {
    // Replace whole object
    setUserData: (_state, action: PayloadAction<UserData>) => action.payload,

    // Merge partial updates (top-level only)
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

    // Posts timestamp (keep if you surface it in UI; otherwise remove)
    setPostsUpdatedAt: (state, action: PayloadAction<string | null>) => {
      state.posts_updated_at = action.payload;
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
} = userDataSlice.actions;

export default userDataSlice.reducer;
