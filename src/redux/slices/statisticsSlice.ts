import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/redux/store';

export type Statistics = {
  linkedin: string;
  twitter: string;
  threads: string;
  official: string;
};

type StatisticsState = {
  data: Statistics | null;
  loading: boolean;
  error: string | null;
   total: string;  
};

const initialState: StatisticsState = {
  data: null,
  loading: false,
  error: null,
  total: '0', 
};

const toInt = (v?: string | null) => {
  const n = Number(v ?? '0');
  return Number.isFinite(n) ? n : 0;
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess(state, action: PayloadAction<Statistics>) {
      state.data = action.payload;
      state.loading = false;
      // optional: auto-derive total on fetch
      const d = action.payload;
      state.total = String(
        toInt(d.linkedin) + toInt(d.twitter) + toInt(d.threads) + toInt(d.official)
      );
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    reset(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.total = '0';
    },
    computeTotal(state) { // 👈 new action
      const d = state.data;
      const total = d
        ? toInt(d.linkedin) + toInt(d.twitter) + toInt(d.threads) + toInt(d.official)
        : 0;
      state.total = String(total);
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, reset, computeTotal } =
  statisticsSlice.actions;
export default statisticsSlice.reducer;

export const selectStatistics = (state: RootState) => state.statistics;

export const selectTotalStatistics = (state: RootState) => state.statistics.total;
