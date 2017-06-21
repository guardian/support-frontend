// @flow

// ----- Types ----- //

type User = {
  email: ?string,
  displayName: ?string,
  firstName: ?string,
  lastName: ?string,
};

type Action =
  | { type: 'SET_FIRST_NAME', name: string }
  | { type: 'SET_LAST_NAME', name: string }
  ;


// ----- Setup ----- //

const initialState: User = window.guardian && window.guardian.user ? {
  email: window.guardian.user.email,
  displayName: window.guardian.user.displayName,
  firstName: window.guardian.user.firstName,
  lastName: window.guardian.user.lastName,
} : {
  email: null,
  displayName: null,
  firstName: null,
  lastName: null,
};


// ----- Actions ----- //

export function setFirstName(name: string): Action {
  return { type: 'SET_FIRST_NAME', name };
}

export function setLastName(name: string): Action {
  return { type: 'SET_LAST_NAME', name };
}


// ----- Exports ----- //

export default function userReducer(
  state: User = initialState,
  action: Action): User {

  switch (action.type) {

    case 'SET_FIRST_NAME':
      return Object.assign({}, state, { firstName: action.name });

    case 'SET_LAST_NAME':
      return Object.assign({}, state, { lastName: action.name });

    default:
      return state;

  }

}
