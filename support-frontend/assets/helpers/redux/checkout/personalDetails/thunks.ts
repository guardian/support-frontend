import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson, getRequestOptions } from 'helpers/async/fetch';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { routes } from 'helpers/urls/routes';
import type { UserType, UserTypeFromIdentityResponse } from './state';
import { emailRules } from './state';

type UserTypeResponse = { userType: UserType };

export const getUserTypeFromIdentity = createAsyncThunk<
	UserTypeFromIdentityResponse,
	string,
	{
		state: SubscriptionsState | ContributionsState;
	}
>(
	'personalDetails/getUserTypeFromIdentity',
	async function getUserType(email, thunkApi) {
		const { isSignedIn } = thunkApi.getState().page.user;
		const { csrf } = thunkApi.getState().page.checkoutForm;
		if (isSignedIn || !emailRules.safeParse(email).success) {
			return 'noRequestSent';
		}

		const resp = (await fetchJson(
			`${routes.getUserType}?maybeEmail=${encodeURIComponent(email)}`,
			getRequestOptions('same-origin', csrf),
		)) as UserTypeResponse;

		if (typeof resp.userType !== 'string') {
			throw new Error('userType string was not present in response');
		}
		return resp.userType;
	},
);
