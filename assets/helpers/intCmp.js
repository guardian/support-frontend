// @flow

// ----- Reducer ----- //

const intCmpReducer = (state: string = ''): string => {
  // Since nothing change the INTCMP, this reducer does not handle any action.
  return state;
}

export {
  intCmpReducer, // eslint-disable-line import/prefer-default-export
};
