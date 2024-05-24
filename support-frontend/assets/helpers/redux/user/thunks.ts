import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchJson } from 'helpers/async/fetch';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import * as cookie from 'helpers/storage/cookie';
import { oktaAuthHeader } from '../../utilities/authorisation';
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
		const authWithOkta = isSwitchOn('featureSwitches.authenticateWithOkta');
		const accessToken = cookie.get('GU_ACCESS_TOKEN');

		// Exit early if Okta isn't enabled or we're missing the access token
		if (!authWithOkta || !accessToken) {return {};}

		const attributes = await fetchJson<UserAttributes>(
			`${window.guardian.mdapiUrl}/user-attributes/me`,
			{
				mode: 'cors',
				credentials: 'include',
				// Okta authorization uses the Authorization header rather than a cookie
				headers: oktaAuthHeader(authWithOkta, accessToken),
			},
		);

		return attributes.contentAccess ?? {};
	},
);
