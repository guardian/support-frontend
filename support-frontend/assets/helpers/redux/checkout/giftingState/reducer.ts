import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Title } from 'helpers/user/details';
import { initialGiftingState } from './state';

export const giftingSlice = createSlice({
	name: 'gifting',
	initialState: initialGiftingState,
	reducers: {
		setTitle(state, action: PayloadAction<Title>) {
			state.title = action.payload;
		},
		setFirstName(state, action: PayloadAction<string>) {
			state.firstName = action.payload;
		},
		setLastName(state, action: PayloadAction<string>) {
			state.lastName = action.payload;
		},
		setEmail(state, action: PayloadAction<string>) {
			state.email = action.payload;
		},
		setGiftMessage(state, action: PayloadAction<string>) {
			state.giftMessage = action.payload;
		},
		setGiftDeliveryDate(state, action: PayloadAction<string>) {
			state.giftDeliveryDate = action.payload;
		},
	},
});

export const giftingReducer = giftingSlice.reducer;
