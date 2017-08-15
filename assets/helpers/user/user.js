// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';
import * as cookie from 'helpers/cookie';

import {
  setDisplayName,
  setEmail,
  setFirstName,
  setLastName,
  setTestUser,
  setFullName,
} from './userActions';


// ----- Functions ----- //

const init = (dispatch: Function) => {

  const windowHasUser = window.guardian && window.guardian.user;
  const userAppearsLoggedIn = cookie.get('GU_U');

  if (window.guardian && window.guardian.uatMode) {
    dispatch(setTestUser(true));
  }
  if (windowHasUser) {
    dispatch(setEmail(window.guardian.user.email));
    dispatch(setDisplayName(window.guardian.user.displayName));
    dispatch(setFirstName(window.guardian.user.firstName));
    dispatch(setLastName(window.guardian.user.lastName));
    dispatch(setFullName(`${window.guardian.user.firstName} ${window.guardian.user.lastName}`));
  } else if (userAppearsLoggedIn) {
    fetch(routes.oneOffContribAutofill, { credentials: 'include' }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          if (data.name) {
            dispatch(setFullName(data.name));
          }
          if (data.email) {
            dispatch(setEmail(data.email));
          }
        });
      }
    });
  }
};


// ----- Exports ----- //

export {
  init,
};
