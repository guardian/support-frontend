import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './state';

export const recaptchaSlice = createSlice({
	name: 'recaptcha',
	initialState,
	reducers: {
		setRecaptchaToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
			state.completed = true;
		},
	},
});

export const recaptchaReducer = recaptchaSlice.reducer;
