// @flow

// ----- Imports ----- //

import type { Action } from './userActions';


// ----- Types ----- //

export type User = {
  id: ?string,
  email: ?string,
  displayName: ?string,
  firstName: ?string,
  lastName: ?string,
  isTestUser: ?boolean,
  isPostDeploymentTestUser: ?boolean,
  fullName?: string,
  stateField?: string,
  postcode?: string,
  gnmMarketing: boolean,
};


// ----- Setup ----- //

const initialState: User = {
  id: '',
  email: '',
  displayName: '',
  firstName: '',
  lastName: '',
  isTestUser: null,
  isPostDeploymentTestUser: null,
  gnmMarketing: false,
};


// ----- Reducer ----- //

function userReducer(
  state: User = initialState,
  action: Action,
): User {

  switch (action.type) {
    case 'SET_USER_ID':
      return Object.assign({}, state, { id: action.id });

    case 'SET_DISPLAY_NAME':
      return Object.assign({}, state, { displayName: action.name });

    case 'SET_FIRST_NAME':
      return Object.assign({}, state, { firstName: action.name });

    case 'SET_LAST_NAME':
      return Object.assign({}, state, { lastName: action.name });

    case 'SET_FULL_NAME':
      return Object.assign({}, state, { fullName: action.name });

    case 'SET_TEST_USER':
      return Object.assign({}, state, { isTestUser: action.testUser });

    case 'SET_POST_DEPLOYMENT_TEST_USER':
      return Object.assign({}, state, { isPostDeploymentTestUser: action.postDeploymentTestUser });

    case 'SET_EMAIL':
      return Object.assign({}, state, { email: action.email });

    case 'SET_STATEFIELD':
      return Object.assign({}, state, { stateField: action.stateField });

    case 'SET_POSTCODE':
      return Object.assign({}, state, { postcode: action.postcode });

    case 'SET_GNM_MARKETING':
      return Object.assign({}, state, { gnmMarketing: action.preference });

    default:
      return state;

  }

}

export {
  userReducer,
};
