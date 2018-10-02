// @flow

import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';


type Credentials = 'omit' | 'same-origin' | 'include';


/** Sends a request to an API and converts the response into a JSON object */
function fetchJson(endpoint: string, settings: Object): Promise<Object> {
  return fetch(endpoint, settings).then(resp => resp.json());
}

/** Builds a `RequestInit` object for use with GET requests using the Fetch API */
function getRequestOptions(
  credentials: Credentials,
  csrf: CsrfState | null,
): Object {
  const headers = csrf !== null
    ? { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' }
    : { 'Content-Type': 'application/json' };

  return {
    method: 'GET',
    headers,
    credentials,
  };
}

/** Builds a `RequestInit` object for use with POST requests using the Fetch API */
function postRequestOptions(
  data: Object,
  credentials: Credentials,
  csrf: CsrfState | null,
): Object {
  return { ...getRequestOptions(credentials, csrf), method: 'POST', body: JSON.stringify(data) };
}

export { fetchJson, getRequestOptions, postRequestOptions };
