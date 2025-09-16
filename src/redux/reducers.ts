import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userDataReducer from './slices/userDataSlice';
import postsReducer from './slices/postsSlice';

const appReducer = combineReducers({
  auth: authReducer,
  userData: userDataReducer,
  posts: postsReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === 'LOGOUT') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
