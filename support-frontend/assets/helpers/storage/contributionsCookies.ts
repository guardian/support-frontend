import { set } from './cookie';

const HIDE_SUPPORT_MESSAGING_COOKIE = 'gu_hide_support_messaging';
const HIDE_SUPPORT_MESSAGING_DAYS_TO_LIVE = 90;

export const setHideSupportMessaginCookie = (): void => {
	const currentTimeInEpochMilliseconds: number = Date.now();

	set(
		HIDE_SUPPORT_MESSAGING_COOKIE,
		currentTimeInEpochMilliseconds.toString(),
		HIDE_SUPPORT_MESSAGING_DAYS_TO_LIVE,
	);
};
