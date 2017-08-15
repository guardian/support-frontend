// @flow

// ----- Reducer ----- //

// Since nothing (currently) can change the isoCountry, this reducer does not handle any actions.
const isoCountryReducer = (state: ?string = null): ?string => state;

export {
  isoCountryReducer,
};
