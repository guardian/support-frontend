// @flow

// ----- Functions ----- //

const getQueryParameter = (paramName: string, defaultValue: string): string => {

  const params = new URLSearchParams(window.location.search);

  return params.get(paramName) || defaultValue;

};

// ----- Exports ----- //

export default getQueryParameter;
