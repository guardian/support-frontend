// @flow

// ----- Functions ----- //

const getQueryParameter = (paramName: string, defaultValue?: string): ?string => {

  const params = new URLSearchParams(window.location.search);

  return params.get(paramName) || defaultValue;

};

const addQueryParamToURL = (urlStr: string, paramsKey: string, paramsValue: ?string): string => {
  const url = new URL(urlStr);
  const params = new URLSearchParams(url.search);

  if (paramsValue !== undefined && paramsValue !== null) {
    params.set(paramsKey, paramsValue);
  }

  return `${url.toString()}?${params.toString()}`;
};

// ----- Exports ----- //
export {
  getQueryParameter,
  addQueryParamToURL,
};
