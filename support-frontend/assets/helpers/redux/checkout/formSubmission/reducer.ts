import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { submitForm } from './thunks';

export const formSubmissionSlice = createSlice({
	name: 'formSubmission',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(submitForm.fulfilled, (_state, action) => {
			return action.payload;
		});
	},
});
