import { set } from './cookie';

const ONE_OFF_CONTRIBUTION_COOKIE_NAME = 'gu.contributions.contrib-timestamp';
const ONE_OFF_CONTRIBUTION_COOKIE_NAME_DAYS_TO_LIVE = 90;

export const setOneOffContributionCookie = (): void => {
	const currentTimeInEpochMilliseconds: number = Date.now();

	set(
		ONE_OFF_CONTRIBUTION_COOKIE_NAME,
		currentTimeInEpochMilliseconds.toString(),
		ONE_OFF_CONTRIBUTION_COOKIE_NAME_DAYS_TO_LIVE,
	);
};
