// @flow

// ----- Types ----- //

export type Domain
  = 'thegulocal.com'
  | 'code.dev-theguardian.com'
  | 'theguardian.com';

export type Env = 'DEV' | 'CODE' | 'PROD';


// ----- Setup ----- //

const DOMAINS: {
  [Env]: Domain,
} = {
  DEV: 'thegulocal.com',
  CODE: 'code.dev-theguardian.com',
  PROD: 'theguardian.com',
};


// ----- Functions ----- //

const getQueryParameter = (paramName: string, defaultValue?: string): ?string => {

  const params = new URL(window.location).searchParams;

  return params.get(paramName) ||
    params.get(paramName.toLowerCase()) ||
    params.get(paramName.toUpperCase()) ||
    defaultValue;

};

const getAllQueryParamsWithExclusions = (excluded: string[]): Array<[string, string]> => Array
  .from(new URL(window.location).searchParams.entries())
  .filter(p => excluded.indexOf(p[0]) === -1);

const addQueryParamToURL = (urlOrPath: string, paramsKey: string, paramsValue: ?string): string => {

  // We are interested in the query params i.e. the part after the '?'
  const strParts = urlOrPath.split('?');

  // Save the first part of the urlOrPath and drop it from the strParts array.
  const strInit = strParts.shift();

  // I concatenate the rest of the array's values since all of them are query params.
  const params = strParts.reduce((a, b) => `${a}?${b}`, '');

  // Add the new param to the list of params.
  const paramsObj = new URLSearchParams(params);

  if (paramsValue !== undefined && paramsValue !== null) {
    paramsObj.set(paramsKey, paramsValue);
  }

  return `${strInit}?${paramsObj.toString()}`;
};

// Takes a mapping of query params and adds to an absolute or relative URL.
function addQueryParamsToURL(
  urlString: string,
  params: { [string]: string },
): string {

  const [baseUrl, ...oldParams] = urlString.split('?');
  const searchParams = new URLSearchParams(oldParams.join('&'));

  Object.keys(params).forEach(key =>
    searchParams.set(key, params[key]));

  return `${baseUrl}?${searchParams.toString()}`;

}

// Retrieves the domain for the given env, e.g. guardian.com/gulocal.com.
function getBaseDomain(): Domain {

  const loc = window.location;
  const origin = window.location.origin ||
    `${loc.protocol}//${loc.hostname}${loc.port ? `:${loc.port}` : ''}`;

  if (origin.includes(DOMAINS.DEV)) {
    return DOMAINS.DEV;
  } else if (origin.includes(DOMAINS.CODE)) {
    return DOMAINS.CODE;
  }

  return DOMAINS.PROD;

}

function getAbsoluteURL(path: string): string {
  const loc = window.location;
  const origin = window.location.origin ||
    `${loc.protocol}//${loc.hostname}${loc.port ? `:${loc.port}` : ''}`;

  return `${origin}${path}`;
}


// ----- Exports ----- //

export {
  getQueryParameter,
  getAllQueryParamsWithExclusions,
  addQueryParamToURL,
  getBaseDomain,
  addQueryParamsToURL,
  getAbsoluteURL,
};
