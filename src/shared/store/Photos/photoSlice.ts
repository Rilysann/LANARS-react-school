import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IPhoto } from 'shared/interfaces/photo.interface';
import API from 'core/services/API';

export const getPhotoItems = createAsyncThunk(
  'photo/getPhotoItems',
  async (ids: Array<number>, { rejectWithValue }) => {
    try {
      if (ids.length === 1) {
        const resp = await API.get(`/api/photos?ids=${ids[0]}`) as IPhoto;
        return resp;
      } else {
        const resp = await API.get(`/api/photos${ids.length > 0 ? `?ids=${ids.join(',')}` : ''}`) as IPhoto[];
        return resp;
      }

    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const createPhoto = createAsyncThunk(
  'photo/createPhoto',
  async (data: IPhoto, { rejectWithValue }) => {
    try {
      const resp = await API.post('/api/photos', data) as IPhoto;
      return resp;
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const updatePhoto = createAsyncThunk(
  'photo/updatePhoto',
  async (data: IPhoto, { rejectWithValue }) => {
    try {
      const resp = await API.patch('/api/photos', data) as IPhoto;
      return resp;
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const deletePhoto = createAsyncThunk(
  'photo/deletePhoto',
  async (ids: Array<number>, { rejectWithValue }) => {
    try {
      const resp = await API.delete(`/api/photos?ids=${ids.join(',')}`) as Array<number>;
      return resp;
    } catch (error) {
      return rejectWithValue(error);
    }
  });

const initialState: { photoItems: Array<IPhoto> } = {
  photoItems: [],
};

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPhotoItems.fulfilled, (state, action) => {
        state.photoItems = Array.isArray(action.payload) ? [...action.payload] : [action.payload];
      })

      .addCase(createPhoto.fulfilled, (state, action) => {
        state.photoItems.push(action.payload);
      })

      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.photoItems = state.photoItems.map(
          (photo: IPhoto) => photo.id === action.payload.id ? action.payload : photo
        );
      })

      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.photoItems = state.photoItems.filter(
          (photo: IPhoto) => !action.payload.includes(photo.id)
        );
      });
  },
});

export default photoSlice.reducer;
