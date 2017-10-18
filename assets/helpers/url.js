// @flow

// ----- Types ----- //

export type Domain
  = 'thegulocal.com'
  | 'code.dev-theguardian.com'
  | 'theguardian.com'
  ;

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

  const params = new URLSearchParams(window.location.search);

  return params.get(paramName) ||
    params.get(paramName.toLowerCase()) ||
    params.get(paramName.toUpperCase()) ||
    defaultValue;

};

const getQueryParams = (excluded: string[]): [string, string][] => Array
  .from(new URLSearchParams(window.location.search))
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

// Retrieves the domain for the given env, e.g. guardian.com/gulocal.com.
function getBaseDomain(): Domain {

  const origin = window.location.origin;

  if (origin.includes(DOMAINS.DEV)) {
    return DOMAINS.DEV;
  } else if (origin.includes(DOMAINS.CODE)) {
    return DOMAINS.CODE;
  }

  return DOMAINS.PROD;

}


// ----- Exports ----- //

export {
  getQueryParameter,
  getQueryParams,
  addQueryParamToURL,
  getBaseDomain,
};
