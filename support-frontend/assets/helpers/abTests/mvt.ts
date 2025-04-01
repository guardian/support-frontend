import * as cookie from '../storage/cookie';

const MVT_COOKIE = 'GU_mvt_id';
export const MVT_MAX = 1_000_000;

// Attempts to retrieve the MVT id from a cookie, or sets it.
export function getMvtId(): number {
	const mvtIdCookieValue = cookie.get(MVT_COOKIE);
	let mvtId = Number(mvtIdCookieValue);

	if (
		Number.isNaN(mvtId) ||
		mvtId >= MVT_MAX ||
		mvtId < 0 ||
		mvtIdCookieValue === null
	) {
		mvtId = Math.floor(Math.random() * MVT_MAX);
		cookie.set(MVT_COOKIE, String(mvtId));
	}

	return mvtId;
}
