import { createAsyncThunk,createSlice } from '@reduxjs/toolkit';

import { getUsers } from '../../api/endpoints/users';

export const fetchUsers = createAsyncThunk('getUsers', async (params, { rejectWithValue }) => {
  try {
    return await getUsers(params);
  } catch (err) {
    return rejectWithValue(err?.message);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
