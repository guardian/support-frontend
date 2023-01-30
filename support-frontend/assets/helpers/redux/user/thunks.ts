import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson, getRequestOptions } from 'helpers/async/fetch';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import { emailRules } from 'helpers/redux/utils/validation/commonRules';
import { routes } from 'helpers/urls/routes';
import type { UserType, UserTypeFromIdentityResponse } from './state';

// {"userId":"103850032","digitalSubscriptionExpiryDate":"2999-01-01","showSupportMessaging":false,"contentAccess":{"member":false,"paidMember":false,"recurringContributor":false,"supporterPlus":false,"digitalPack":true,"paperSubscriber":false,"guardianWeeklySubscriber":false,"guardianPatron":false}}

export const getRecurringContributorStatus = createAsyncThunk<
	boolean,
	undefined
>(
	'user/getRecurringContributorStatus',
	async function getIsRecurringContributor() {
		const attributes = await fetchJson(
			`${window.guardian.mdapiUrl}/user-attributes/me`,
			{
				mode: 'cors',
				credentials: 'include',
			},
		);

		if (attributes.recurringContributionPaymentPlan) {
			return true;
		}

		return false;
	},
);

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
		const { csrf } = thunkApi.getState().page.checkoutForm;

		const resp = (await fetchJson(
			`${routes.getUserType}?maybeEmail=${encodeURIComponent(email)}`,
			getRequestOptions('same-origin', csrf),
		)) as UserTypeResponse;

		if (typeof resp.userType !== 'string') {
			throw new Error('userType string was not present in response');
		}
		return resp.userType;
	},
	{
		condition: (email, thunkApi) => {
			const { userTypeFromIdentityResponse, isSignedIn } =
				thunkApi.getState().page.checkoutForm.personalDetails;
			const { isStorybookUser } = thunkApi.getState().page.user;

			const emailInvalid = !emailRules.safeParse(email).success;
			const requestInFlight = userTypeFromIdentityResponse === 'requestPending';

			if (isSignedIn || emailInvalid || requestInFlight || isStorybookUser) {
				return false;
			}
		},
	},
);
