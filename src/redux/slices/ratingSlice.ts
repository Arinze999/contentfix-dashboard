import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type RatingRpcRow = {
  level: number | null;
  info: string | null;
  rating_updated_at: string | null;
};

type RatingState = {
  level: number | null;
  info: string;
  ratingUpdatedAt: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: RatingState = {
  level: null,
  info: '',
  ratingUpdatedAt: null,
  loading: false,
  error: null,
};

const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    setPending(state) {
      state.loading = true;
      state.error = null;
    },
    setSuccess(state, action: PayloadAction<RatingRpcRow>) {
      const { level, info, rating_updated_at } = action.payload;
      state.level = level ?? null;
      state.info = info ?? '';
      state.ratingUpdatedAt = rating_updated_at ?? null;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setFromRpc(state, action: PayloadAction<RatingRpcRow>) {
      // alias to setSuccess if you prefer a more semantic name
      const { level, info, rating_updated_at } = action.payload;
      state.level = level ?? null;
      state.info = info ?? '';
      state.ratingUpdatedAt = rating_updated_at ?? null;
      state.loading = false;
      state.error = null;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPending: ratingSetPending,
  setSuccess: ratingSetSuccess,
  setError: ratingSetError,
  setFromRpc: ratingSetFromRpc,
  reset: ratingReset,
} = ratingSlice.actions;

export default ratingSlice.reducer;

// selectors
export const selectRating = (s: any) => s.rating as RatingState;
export const selectRatingLoading = (s: any) => (s.rating as RatingState).loading;
export const selectRatingError = (s: any) => (s.rating as RatingState).error;
