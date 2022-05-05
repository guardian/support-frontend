import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import type { Title } from 'helpers/user/details';
import { initialPersonalDetailsState } from './state';

export const personalDetailsSlice = createSlice({
	name: 'personalDetails',
	initialState: initialPersonalDetailsState,
	reducers: {
		setTitle(state, action: PayloadAction<Title>) {
			const newTitle =
				action.payload !== 'Select a title' ? action.payload : state.title;
			state.title = newTitle;
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
		setConfirmEmail(state, action: PayloadAction<string>) {
			state.confirmEmail = action.payload;
		},
		setIsSignedIn(state, action: PayloadAction<boolean>) {
			state.isSignedIn = action.payload;
		},
		setUserTypeFromIdentityResponse(
			state,
			action: PayloadAction<UserTypeFromIdentityResponse>,
		) {
			state.userTypeFromIdentityResponse = action.payload;
		},
		setTelephone(state, action: PayloadAction<string>) {
			state.telephone = action.payload;
		},
	},
});

export const personalDetailsReducer = personalDetailsSlice.reducer;
