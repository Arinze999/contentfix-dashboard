// store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '@/models/auth/SignIn.model';
import { initialState } from '@/models/auth/SignIn.model';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      return action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
