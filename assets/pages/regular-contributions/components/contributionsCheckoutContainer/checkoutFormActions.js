// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_EMAIL_SHOULD_VALIDATE' }
  | { type: 'SET_FIRST_NAME_SHOULD_VALIDATE' }
  | { type: 'SET_LAST_NAME_SHOULD_VALIDATE' }


// ----- Actions Creators ----- //


export function setEmailShouldValidate(): Action {
  return { type: 'SET_EMAIL_SHOULD_VALIDATE' };
}

export function setFirstNameShouldValidate(): Action {
  return { type: 'SET_FIRST_NAME_SHOULD_VALIDATE' };
}

export function setLastNameShouldValidate(): Action {
  return { type: 'SET_LAST_NAME_SHOULD_VALIDATE' };
}

