import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import 'helpers/csrf/csrfReducer';

type Credentials = 'omit' | 'same-origin' | 'include';

/** Sends a request to an API and converts the response into a JSON object */
async function fetchJson(
	endpoint: RequestInfo,
	settings: RequestInit,
): Promise<Record<string, unknown>> {
	const resp = await fetch(endpoint, settings);
	return (await resp.json()) as Record<string, unknown>;
}

type GetRequestHeaders = {
	'Content-Type': 'application/json';
	'Csrf-Token'?: string;
};

type GetRequestOptions = {
	method: 'GET';
	headers: GetRequestHeaders;
	credentials: Credentials;
};

/** Builds a `RequestInit` object for use with GET requests using the Fetch API */
function getRequestOptions(
	credentials: Credentials,
	csrf: CsrfState | null,
): GetRequestOptions {
	const headers: GetRequestHeaders =
		csrf !== null
			? {
					'Content-Type': 'application/json',
					'Csrf-Token': csrf.token ?? '',
			  }
			: {
					'Content-Type': 'application/json',
			  };

	return {
		method: 'GET',
		headers,
		credentials,
	};
}

/** Builds a `RequestInit` object for the Fetch API */
function requestOptions(
	data: Record<string, unknown>,
	credentials: Credentials,
	method: 'POST' | 'PUT' | 'PATCH',
	csrf: CsrfState | null,
): Record<string, unknown> {
	return {
		...getRequestOptions(credentials, csrf),
		method,
		body: JSON.stringify(data),
	};
}

export { fetchJson, getRequestOptions, requestOptions };
