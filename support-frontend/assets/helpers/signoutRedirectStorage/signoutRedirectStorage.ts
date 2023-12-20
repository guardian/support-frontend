import * as storage from 'helpers/storage/storage';

const REDIRECT_AFTER_SIGNOUT_STORAGE_KEY = 'redirectAfterSignOut';

export const setSignOutRedirectInStorage = (): void => {
	storage.setSession(REDIRECT_AFTER_SIGNOUT_STORAGE_KEY, window.location.href);
};

export const checkSignOutRedirectInStorage = (): void => {
	const redirectUrlFromSessionStorage = storage.getSession(
		REDIRECT_AFTER_SIGNOUT_STORAGE_KEY,
	);
	//This check is to make sure we are retaining the url with query params when we hit sign out
	if (redirectUrlFromSessionStorage) {
		storage.setSession(REDIRECT_AFTER_SIGNOUT_STORAGE_KEY, '');
		window.location.href = redirectUrlFromSessionStorage;
	}
};
