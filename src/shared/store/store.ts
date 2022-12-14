import { configureStore } from '@reduxjs/toolkit';
import photoSlice from './Photos/photoSlice';
import albumSlice from './Albums/albumSlice';

export const store = configureStore({
  reducer: {
    photos: photoSlice,
    albums: albumSlice,
  },
});
