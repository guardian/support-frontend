// @flow

// ----- Imports ----- //

import { setDisplayName, setEmail, setFirstName, setLastName, setTestUser, setFullName } from './userActions';
import * as cookie from './../cookie';

export default function (dispatch: Function) {

  const AUTOFILL_ENDPOINT = '/oneoff-contributions/autofill';

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
    fetch(AUTOFILL_ENDPOINT, { credentials: 'include' }).then((response) => {
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
}
