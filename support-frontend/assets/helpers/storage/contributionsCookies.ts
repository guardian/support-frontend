import { set } from './cookie';

const HIDE_SUPPORT_MESSAGING_COOKIE_NAME = 'gu_hide_support_messaging';
const HIDE_SUPPORT_MESSAGING_COOKIE_DAYS_TO_LIVE = 90;

export const setHideSupportMessagingCookie = (): void => {
	set(
		HIDE_SUPPORT_MESSAGING_COOKIE_NAME,
		'true',
		HIDE_SUPPORT_MESSAGING_COOKIE_DAYS_TO_LIVE,
	);
};
