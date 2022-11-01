// ----- Types ----- //
export type Domain =
	| 'thegulocal.com'
	| 'code.dev-theguardian.com'
	| 'theguardian.com';
export type Env = 'DEV' | 'CODE' | 'PROD';
// ----- Setup ----- //
const DOMAINS: Record<Env, Domain> = {
	DEV: 'thegulocal.com',
	CODE: 'code.dev-theguardian.com',
	PROD: 'theguardian.com',
};

// ----- Functions ----- //
const getQueryParameter = (paramName: string, defaultValue = ''): string => {
	const params = new URL(window.location.href).searchParams;
	return (
		params.get(paramName) ??
		params.get(paramName.toLowerCase()) ??
		params.get(paramName.toUpperCase()) ??
		defaultValue
	);
};

// Drop leading '?'
// Turn into array of 'param=value'
// Turn each param into array of '[param, value]'
// Filter out items that are not key-value pairs
const getAllQueryParams = (): Array<[string, string]> =>
	window.location.search
		.slice(1)
		.split('&')
		.map((a) => a.split('='))
		// Asserting the return type because this filter means this will *always* return an array of arrays of two strings
		.filter((a) => a.length === 2 && a.every((e) => e !== '')) as Array<
		[string, string]
	>;

const getAllQueryParamsWithExclusions = (
	excluded: string[],
): Array<[string, string]> =>
	getAllQueryParams().filter((p: string[]) => !excluded.includes(p[0]));

// Takes a mapping of query params and adds to an absolute or relative URL.
function addQueryParamsToURL(
	urlString: string,
	params: Record<string, string | null | undefined>,
): string {
	const [baseUrl, ...oldParams] = urlString.split('?');
	const searchParams = new URLSearchParams(oldParams.join('&'));
	Object.keys(params).forEach(
		(key) => params[key] && searchParams.set(key, params[key] as string),
	);
	return `${baseUrl}?${searchParams.toString()}`;
}

function getOrigin(): string {
	const loc = window.location;
	return (
		window.location.origin ||
		`${loc.protocol}//${loc.hostname}${loc.port ? `:${loc.port}` : ''}`
	);
}

// Retrieves the domain for the given env, e.g. guardian.com/gulocal.com.
function getBaseDomain(): Domain {
	const origin = getOrigin();

	if (origin.includes(DOMAINS.DEV)) {
		return DOMAINS.DEV;
	} else if (origin.includes(DOMAINS.CODE)) {
		return DOMAINS.CODE;
	}

	return DOMAINS.PROD;
}

function getAbsoluteURL(path = ''): string {
	return `${getOrigin()}${path}`;
}

function isProd(): boolean {
	return getBaseDomain() === 'theguardian.com';
}

function isCodeOrProd(): boolean {
	return window.location.hostname.includes('theguardian.com');
}

// ----- Exports ----- //
export {
	getQueryParameter,
	getAllQueryParams,
	getAllQueryParamsWithExclusions,
	getOrigin,
	getBaseDomain,
	addQueryParamsToURL,
	getAbsoluteURL,
	isProd,
	isCodeOrProd,
};
