// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_FULL_NAME_SHOULD_VALIDATE' }
  | { type: 'SET_EMAIL_SHOULD_VALIDATE' }


// ----- Actions Creators ----- //


export function setEmailShouldValidate(): Action {
  return { type: 'SET_EMAIL_SHOULD_VALIDATE' };
}

export function setFullNameShouldValidate(): Action {
  return { type: 'SET_FULL_NAME_SHOULD_VALIDATE' };
}
