// @flow

// ----- Functions ----- //

const getQueryParameter = (paramName: string, defaultValue?: string): ?string => {

  const params = new URLSearchParams(window.location.search);

  return params.get(paramName) || defaultValue;

};


const addQueryParamToURL = (str: string, paramsKey: string, paramsValue: ?string): string => {
  // str can be a full URL (i.e. https://...?q1=a) or a path (i.e. '/...?q1=a).
  // Whatever is the case, I am interested in the query params i.e. the part after the '?'
  const strParts = str.split('?');

  // Save the first part of the str since is my protocol://host:port or path.
  const strInit = strParts[0];

  // Drop the URL.
  strParts.splice(0, 1);

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
