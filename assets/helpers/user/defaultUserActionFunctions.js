// @flow

import { setSession } from 'helpers/storage';
import { type Action } from './userActions';

// ----- Actions Creators ----- //

function setId(id: string): Action {
  return { type: 'SET_USER_ID', id };
}

function setDisplayName(name: string): Action {
  return { type: 'SET_DISPLAY_NAME', name };
}

function setFirstName(name: string): Action {
  return { type: 'SET_FIRST_NAME', name };
}

function setLastName(name: string): Action {
  return { type: 'SET_LAST_NAME', name };
}

function setFullName(name: string): Action {
  return { type: 'SET_FULL_NAME', name };
}

function setIsSignedIn(isSignedIn: boolean): Action {
  return { type: 'SET_IS_SIGNED_IN', isSignedIn };
}

function setEmail(email: string): Action {
  // PayPal one-off redirects away from the site before hitting the thank you page
  // so we need to store the email in the storage so that it is available on the
  // thank you page in all scenarios.
  setSession('gu.email', email);
  return { type: 'SET_EMAIL', email };
}

function setStateField(stateField: string): Action {
  return { type: 'SET_STATEFIELD', stateField };
}

function setIsRecurringContributor(): Action {
  return { type: 'SET_IS_RECURRING_CONTRIBUTOR' };
}

function setTestUser(testUser: boolean): Action {
  return { type: 'SET_TEST_USER', testUser };
}

function setPostDeploymentTestUser(postDeploymentTestUser: boolean): Action {
  return { type: 'SET_POST_DEPLOYMENT_TEST_USER', postDeploymentTestUser };
}

function setGnmMarketing(preference: boolean): Action {
  return { type: 'SET_GNM_MARKETING', preference };
}

const defaultUserActionFunctions = {
  setId,
  setDisplayName,
  setFirstName,
  setLastName,
  setFullName,
  setIsSignedIn,
  setEmail,
  setStateField,
  setIsRecurringContributor,
  setTestUser,
  setPostDeploymentTestUser,
  setGnmMarketing,
};

export { defaultUserActionFunctions };
