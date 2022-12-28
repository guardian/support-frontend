import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import type { ContributionsState } from 'helpers/redux/contributionsStore';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';

export const getRecurringContributorStatus = createAsyncThunk<
	boolean,
	undefined,
	{
		state: SubscriptionsState | ContributionsState;
	}
>('user', async function getIsRecurringContributor() {
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
});
