// @flow

// ----- Types ----- //

export type Action = { type: 'SET_VISIT_TOKEN', name: string };


// ----- Actions Creators ----- //

export function setToken(name: string): Action {
  return { type: 'SET_VISIT_TOKEN', name };
}

export default setToken;

