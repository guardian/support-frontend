// @flow

// ----- Imports ----- //
import { type Stage } from './checkoutFormReducer';

// ----- Types ----- //

export type Action =
  | { type: 'SET_EMAIL_SHOULD_VALIDATE', shouldValidate: boolean }
  | { type: 'SET_FIRST_NAME_SHOULD_VALIDATE', shouldValidate: boolean }
  | { type: 'SET_LAST_NAME_SHOULD_VALIDATE', shouldValidate: boolean }
  | { type: 'SET_STAGE', stage: Stage }


// ----- Actions Creators ----- //


export function setEmailShouldValidate(shouldValidate: boolean): Action {
  return { type: 'SET_EMAIL_SHOULD_VALIDATE', shouldValidate };
}

export function setFirstNameShouldValidate(shouldValidate: boolean): Action {
  return { type: 'SET_FIRST_NAME_SHOULD_VALIDATE', shouldValidate };
}

export function setLastNameShouldValidate(shouldValidate: boolean): Action {
  return { type: 'SET_LAST_NAME_SHOULD_VALIDATE', shouldValidate };
}
export function setStage(stage: Stage): Action {
  return { type: 'SET_STAGE', stage };
}

