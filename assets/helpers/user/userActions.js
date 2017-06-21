// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_FIRST_NAME', name: string }
  | { type: 'SET_LAST_NAME', name: string }
  ;


// ----- Actions Creators ----- //

export function setFirstName(name: string): Action {
  return { type: 'SET_FIRST_NAME', name };
}

export function setLastName(name: string): Action {
  return { type: 'SET_LAST_NAME', name };
}

