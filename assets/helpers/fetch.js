// @flow

import { logPromise } from 'helpers/promise';

/** Sends a request to an API and converts the response into a JSON object */
function fetchJson(endpoint: string, settings: Object): Promise<Object> {
  return fetch(endpoint, settings).then(resp => resp.json());
}

export {
  fetchJson
};
