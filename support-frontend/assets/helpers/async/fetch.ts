import type { Csrf as CsrfState } from "helpers/csrf/csrfReducer";
import "helpers/csrf/csrfReducer";
type Credentials = "omit" | "same-origin" | "include";

/** Sends a request to an API and converts the response into a JSON object */
function fetchJson(endpoint: string, settings: Record<string, any>): Promise<Record<string, any>> {
  return fetch(endpoint, settings).then(resp => resp.json());
}

/** Builds a `RequestInit` object for use with GET requests using the Fetch API */
function getRequestOptions(credentials: Credentials, csrf: CsrfState | null): Record<string, any> {
  const headers = csrf !== null ? {
    'Content-Type': 'application/json',
    'Csrf-Token': csrf.token || ''
  } : {
    'Content-Type': 'application/json'
  };
  return {
    method: 'GET',
    headers,
    credentials
  };
}

/** Builds a `RequestInit` object for the Fetch API */
function requestOptions(data: Record<string, any>, credentials: Credentials, method: "POST" | "PUT" | "PATCH", csrf: CsrfState | null): Record<string, any> {
  return { ...getRequestOptions(credentials, csrf),
    method,
    body: JSON.stringify(data)
  };
}

export { fetchJson, getRequestOptions, requestOptions };