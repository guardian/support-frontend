import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import type { SupporterStatus } from './state';

type UserAttributes = {
	userId: string;
	showSupportMessaging: boolean;
	contentAccess?: SupporterStatus;
};

export const getRecurringContributorStatus = createAsyncThunk<
	SupporterStatus,
	undefined
>(
	'user/getRecurringContributorStatus',
	async function getIsRecurringContributor() {
		const attributes = (await fetchJson(
			`${window.guardian.mdapiUrl}/user-attributes/me`,
			{
				mode: 'cors',
				credentials: 'include',
			},
		)) as UserAttributes;

		return attributes.contentAccess ?? {};
	},
);
