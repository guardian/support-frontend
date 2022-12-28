import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { stateProvinceFieldFromString } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { validateForm } from '../checkout/checkoutActions';
import type { UserState } from './state';
import { initialState } from './state';
import { getRecurringContributorStatus } from './thunks';

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<UserState>) {
			const { firstName, lastName } = action.payload;
			const fullName = `${firstName} ${lastName}`;
			return {
				...state,
				...action.payload,
				fullName,
			};
		},
		setEmail(state, action: PayloadAction<string>) {
			state.email = action.payload;
		},
		setEmailValidated(state, action: PayloadAction<boolean>) {
			state.emailValidated = action.payload;
		},
		setIsReturningContributor(state, action: PayloadAction<boolean>) {
			state.isReturningContributor = action.payload;
		},
		setIsSignedIn(state, action: PayloadAction<boolean>) {
			state.isSignedIn = action.payload;
		},
		setTestUserStatus(state, action: PayloadAction<Record<string, boolean>>) {
			state.isTestUser = action.payload.isTestUser;
			state.isPostDeploymentTestUser = action.payload.isPostDeploymentTestUser;
		},
		setStateField(
			state,
			action: PayloadAction<{
				countryGroupId: CountryGroupId;
				stateName: string;
			}>,
		) {
			const stateField = stateProvinceFieldFromString(
				action.payload.countryGroupId,
				action.payload.stateName,
			);

			if (stateField) {
				state.stateField = stateField;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			getRecurringContributorStatus.fulfilled,
			(state, action) => {
				state.isRecurringContributor = action.payload;
			},
		);

		builder.addCase(validateForm, (state) => {
			state.isRecurringContributorError = true;
		});
	},
});

export const userReducer = userSlice.reducer;
