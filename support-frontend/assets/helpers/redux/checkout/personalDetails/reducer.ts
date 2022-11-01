import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';
import { createSliceValidatorFor } from 'helpers/redux/utils/validation/errors';
import type { Title } from 'helpers/user/details';
import { validateForm } from '../checkoutActions';
import { initialPersonalDetailsState, personalDetailsSchema } from './state';

export const personalDetailsSlice = createSlice({
	name: 'personalDetails',
	initialState: initialPersonalDetailsState,
	reducers: {
		setTitle(state, action: PayloadAction<Title>) {
			const newTitle =
				action.payload !== 'Select a title' ? action.payload : state.title;
			state.title = newTitle;
			delete state.errors?.title;
		},
		setFirstName(state, action: PayloadAction<string>) {
			state.firstName = action.payload;
			delete state.errors?.firstName;
		},
		setLastName(state, action: PayloadAction<string>) {
			state.lastName = action.payload;
			delete state.errors?.lastName;
		},
		setEmail(state, action: PayloadAction<string>) {
			state.email = action.payload;
			delete state.errors?.email;
		},
		setConfirmEmail(state, action: PayloadAction<string>) {
			state.confirmEmail = action.payload;
			delete state.errors?.confirmEmail;
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
			delete state.errors?.telephone;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			validateForm,
			createSliceValidatorFor(personalDetailsSchema),
		);
	},
});

export const personalDetailsReducer = personalDetailsSlice.reducer;
