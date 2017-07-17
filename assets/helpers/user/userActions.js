// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_FIRST_NAME', name: string }
  | { type: 'SET_LAST_NAME', name: string }
  | { type: 'SET_FULL_NAME', name: string }
  | { type: 'SET_EMAIL', email: string }
  | { type: 'SET_POSTCODE', postcode: string }
  ;


// ----- Actions Creators ----- //

export function setFirstName(name: string): Action {
  return { type: 'SET_FIRST_NAME', name };
}

export function setLastName(name: string): Action {
  return { type: 'SET_LAST_NAME', name };
}

export function setFullName(name: string): Action {
  return { type: 'SET_FULL_NAME', name };
}

export function setEmail(email: string): Action {
  return { type: 'SET_EMAIL', email };
}

export function setPostcode(postcode: string): Action {
  return { type: 'SET_POSTCODE', postcode };
}
