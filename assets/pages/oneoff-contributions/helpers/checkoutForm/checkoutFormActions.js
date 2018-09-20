// @flow

// ----- Types ----- //

export type Action =
  | { type: 'SET_FULL_NAME_SHOULD_VALIDATE', shouldValidate: boolean }
  | { type: 'SET_EMAIL_SHOULD_VALIDATE', shouldValidate: boolean }


// ----- Actions Creators ----- //


export function setEmailShouldValidate(shouldValidate: boolean): Action {
  return { type: 'SET_EMAIL_SHOULD_VALIDATE', shouldValidate };
}

export function setFullNameShouldValidate(shouldValidate: boolean): Action {
  return { type: 'SET_FULL_NAME_SHOULD_VALIDATE', shouldValidate };
}
