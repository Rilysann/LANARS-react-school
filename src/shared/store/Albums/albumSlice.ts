import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAlbum } from 'shared/interfaces/album.interface';
import API from 'core/services/API';

export const getAlbumItems = createAsyncThunk(
  'album/getAlbumItems',
  async (ids: Array<number>, { rejectWithValue }) => {
    try {
      if (ids.length === 1) {
        const resp = await API.get(`/api/albums?ids=${ids[0]}`) as IAlbum;
        return resp;
      } else {
        const resp = await API.get(`/api/albums${ids.length > 0 ? `?ids=${ids.join(',')}` : ''}`) as IAlbum[];
        return resp;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const createAlbum = createAsyncThunk(
  'album/createAlbum',
  async (data: IAlbum, { rejectWithValue }) => {
    try {
      const resp = await API.post('/api/albums', data) as IAlbum;
      return resp;
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const updateAlbum = createAsyncThunk(
  'photo/updateAlbum',
  async (data: IAlbum, { rejectWithValue }) => {
    try {
      const resp = await API.patch('/api/albums', data) as IAlbum;
      return resp;
    } catch (error) {
      return rejectWithValue(error);
    }
  });

export const deleteAlbum = createAsyncThunk(
  'photo/deleteAlbum',
  async (ids: Array<number>, { rejectWithValue }) => {
    try {
      const resp = await API.delete(`/api/albums?ids=${ids.join(',')}`) as Array<number>;
      return resp;
    } catch (error) {
      return rejectWithValue(error);
    }
  });

const initialState: { albumItems: Array<IAlbum> } = {
  albumItems: [],
};

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAlbumItems.fulfilled, (state, action) => {
        state.albumItems = Array.isArray(action.payload) ? [...action.payload] : [action.payload];
      })

      .addCase(createAlbum.fulfilled, (state, action) => {
        state.albumItems.push(action.payload);
      })

      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.albumItems = state.albumItems.map(
          (album: IAlbum) => album.id === action.payload.id ? action.payload : album
        );
      })

      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.albumItems = state.albumItems.filter(
          (album: IAlbum) => !action.payload.includes(album.id)
        );
      });
  },
});

export default albumSlice.reducer;
