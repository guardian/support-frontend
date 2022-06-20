import { createSlice } from '@reduxjs/toolkit';
import { initialCsrfState } from './state';

export const csrfSlice = createSlice({
	name: 'csrf',
	initialState: initialCsrfState,
	reducers: {},
});

export const csrfReducer = csrfSlice.reducer;
