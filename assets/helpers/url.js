// @flow

// ----- Functions ----- //

const getQueryParameter = (paramName: string, defaultValue?: string): ?string => {

  const params = new URLSearchParams(window.location.search);

  return params.get(paramName) || defaultValue;

};


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

// ----- Exports ----- //
export {
  getQueryParameter,
  addQueryParamToURL,
};
