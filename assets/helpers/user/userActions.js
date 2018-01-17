// @flow

// ----- Types ----- //

import { setSession } from 'helpers/storage';

export type Action =
  | { type: 'SET_USER_ID', id: string }
  | { type: 'SET_DISPLAY_NAME', name: string }
  | { type: 'SET_FIRST_NAME', name: string }
  | { type: 'SET_LAST_NAME', name: string }
  | { type: 'SET_FULL_NAME', name: string }
  | { type: 'SET_EMAIL', email: string }
  | { type: 'SET_STATEFIELD', stateField: string }
  | { type: 'SET_POSTCODE', postcode: string }
  | { type: 'SET_TEST_USER', testUser: boolean }
  | { type: 'SET_POST_DEPLOYMENT_TEST_USER', postDeploymentTestUser: boolean }
  | { type: 'SET_GNM_MARKETING', preference: boolean };


// ----- Actions Creators ----- //

export function setId(id: string): Action {
  return { type: 'SET_USER_ID', id };
}

export function setDisplayName(name: string): Action {
  return { type: 'SET_DISPLAY_NAME', name };
}

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
  setSession('gu.email', email);
  return { type: 'SET_EMAIL', email };
}

export function setStateField(stateField: string): Action {
  return { type: 'SET_STATEFIELD', stateField };
}

export function setPostcode(postcode: string): Action {
  return { type: 'SET_POSTCODE', postcode };
}

export function setTestUser(testUser: boolean): Action {
  return { type: 'SET_TEST_USER', testUser };
}

export function setPostDeploymentTestUser(postDeploymentTestUser: boolean): Action {
  return { type: 'SET_POST_DEPLOYMENT_TEST_USER', postDeploymentTestUser };
}

export function setGnmMarketing(preference: boolean): Action {
  return { type: 'SET_GNM_MARKETING', preference };
}
