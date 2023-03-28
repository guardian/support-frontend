import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';
import { submitForm } from './thunks';

export const formSubmissionSlice = createSlice({
	name: 'formSubmission',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(submitForm.fulfilled, (state, action) => {
			state.status = action.payload;
		});

		builder.addCase(submitForm.pending, (state) => {
			state.status = 'pending';
		});

		builder.addCase(submitForm.rejected, (state, action) => {
			state.status = 'error';
			state.error = action.meta.errorMessage;
		});
	},
});

export const formSubmissionReducer = formSubmissionSlice.reducer;
