import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PostItem } from '@/types/social';

type PostsState = PostItem[];
const initialState: PostsState = [];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (_state, action: PayloadAction<PostItem[]>) => action.payload,

    addPost: (state, action: PayloadAction<PostItem>) => {
      state.push(action.payload);
    },

    updatePost: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<PostItem> }>
    ) => {
      const { id, changes } = action.payload;
      const idx = state.findIndex((p) => p.id === id);
      if (idx !== -1) state[idx] = { ...state[idx], ...changes };
    },

    removePost: (state, action: PayloadAction<string>) =>
      state.filter((p) => p.id !== action.payload),

    // inside reducers: { ... }
    clearPosts: () => [] as PostsState,
  },
});

export const { setPosts, addPost, updatePost, removePost, clearPosts } =
  postsSlice.actions;
export default postsSlice.reducer;
