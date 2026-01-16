import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { setIsSignedIn } from 'helpers/redux/user/actions';
import { createSliceValidatorFor } from 'helpers/redux/utils/validation/errors';
import type { Title } from 'helpers/user/details';
import { resetValidation, validateForm } from '../checkoutActions';
import { initialPersonalDetailsState, personalDetailsSchema } from './state';

const personalDetailsSlice = createSlice({
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

		builder.addCase(resetValidation, (state) => {
			state.errors = {};
		});

		builder.addCase(setIsSignedIn, (state, action) => {
			state.isSignedIn = action.payload;
		});
	},
});

export const personalDetailsReducer = personalDetailsSlice.reducer;
