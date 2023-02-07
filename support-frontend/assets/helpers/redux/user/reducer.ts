import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { validateForm } from '../checkout/checkoutActions';
import { initialState } from './state';
import { getRecurringContributorStatus } from './thunks';

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setIsSignedIn(state, action: PayloadAction<boolean>) {
			state.isSignedIn = action.payload;
		},
		setTestUserStatus(state, action: PayloadAction<Record<string, boolean>>) {
			state.isTestUser = action.payload.isTestUser;
			state.isPostDeploymentTestUser = action.payload.isPostDeploymentTestUser;
		},
		setIsReturningContributor(state, action: PayloadAction<boolean>) {
			state.isReturningContributor = action.payload;
		},
		setStorybookUser(state, action: PayloadAction<boolean>) {
			state.isStorybookUser = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(
			getRecurringContributorStatus.fulfilled,
			(state, action) => {
				state.supporterStatus = action.payload;
			},
		);

		builder.addCase(validateForm, (state) => {
			if (state.supporterStatus.recurringContributor) {
				state.isRecurringContributorError = true;
			}
		});
	},
});

export const userReducer = userSlice.reducer;
