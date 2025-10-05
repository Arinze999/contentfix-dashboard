import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userDataReducer from './slices/userDataSlice';
import postsReducer from './slices/postsSlice';
import personasReducer from './slices/personasSlice';
import statisticsReducer from './slices/statisticsSlice';
import ratingReducer from './slices/ratingSlice';

const appReducer = combineReducers({
  auth: authReducer,
  userData: userDataReducer,
  posts: postsReducer,
  personas: personasReducer,
  statistics: statisticsReducer,
  rating: ratingReducer,
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
