import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { personalDetailsReducer } from './personalDetails/reducer';
import { initialPersonalDetailsState } from './personalDetails/state';

const checkoutFormSlice = createSlice({
	name: 'checkoutForm',
	initialState: {
		personalDetails: initialPersonalDetailsState,
	},
	reducers: {
		setTitle: (state, action: PayloadAction<string>) => {
			state.personalDetails = personalDetailsReducer(
				state.personalDetails,
				action,
			);
		},
	},
});

export const { setTitle } = checkoutFormSlice.actions;
export const checkoutFormReducer = checkoutFormSlice.reducer;
