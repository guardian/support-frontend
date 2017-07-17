// @flow

// ----- Imports ----- //

import type { Action } from './userActions';


// ----- Types ----- //

type User = {
  email: ?string,
  displayName: ?string,
  firstName: ?string,
  lastName: ?string,
  isTestUser: ?string,
  fullName?: string,
  postcode?: string,
};


// ----- Setup ----- //

const initialState: User = window.guardian && window.guardian.user ? {
  email: window.guardian.user.email,
  displayName: window.guardian.user.displayName,
  firstName: window.guardian.user.firstName,
  lastName: window.guardian.user.lastName,
  isTestUser: window.guardian.user.isTestUser,
} : {
  email: null,
  displayName: null,
  firstName: null,
  lastName: null,
  isTestUser: null,
};


// ----- Reducer ----- //

export default function userReducer(
  state: User = initialState,
  action: Action): User {

  switch (action.type) {

    case 'SET_FIRST_NAME':
      return Object.assign({}, state, { firstName: action.name });

    case 'SET_LAST_NAME':
      return Object.assign({}, state, { lastName: action.name });

    case 'SET_FULL_NAME':
      return Object.assign({}, state, { fullName: action.name });

    case 'SET_EMAIL':
      return Object.assign({}, state, { email: action.email });

    case 'SET_POSTCODE':
      return Object.assign({}, state, { postcode: action.postcode });

    default:
      return state;

  }

}
