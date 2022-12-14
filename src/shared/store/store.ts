import { configureStore } from '@reduxjs/toolkit';
import photoSlice from './Photos/photoSlice';

export const store = configureStore({
  reducer: {
    photos: photoSlice,
  },
});
