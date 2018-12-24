// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';
import * as cookie from 'helpers/cookie';
import { get as getCookie } from 'helpers/cookie';
import { getSession } from 'helpers/storage';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import type { UserSetStateActions } from 'helpers/user/userActions';


// ----- Functions ----- //

function isTestUser(): boolean {
  const isDefined = x => x !== null && x !== undefined;
  const uatMode = window.guardian && window.guardian.uatMode;
  const testCookie = cookie.get('_test_username');
  return isDefined(uatMode) || isDefined(testCookie);
}

const init = (dispatch: Function, actions: UserSetStateActions = defaultUserActionFunctions) => {

  const {
    setId,
    setDisplayName,
    setFirstName,
    setLastName,
    setFullName,
    setIsSignedIn,
    setEmail,
    setIsRecurringContributor,
    setTestUser,
    setPostDeploymentTestUser,
  } = actions;

  const windowHasUser = window.guardian && window.guardian.user;
  const userAppearsLoggedIn = cookie.get('GU_U');

  function getEmailFromBrowser(): ?string {
    if (window.guardian && window.guardian.email) {
      return window.guardian.email;
    }
    return getSession('gu.email');
  }

  const emailFromBrowser = getEmailFromBrowser();

  if (isTestUser()) {
    dispatch(setTestUser(true));
  }

  if (isTestUser() && cookie.get('_post_deploy_user')) {
    dispatch(setPostDeploymentTestUser(true));
  }

  if (getCookie('gu_recurring_contributor') === 'true') {
    dispatch(setIsRecurringContributor());
  }

  if (windowHasUser) {
    dispatch(setId(window.guardian.user.id));
    dispatch(setEmail(window.guardian.user.email));
    dispatch(setDisplayName(window.guardian.user.displayName));
    dispatch(setFirstName(window.guardian.user.firstName));
    dispatch(setLastName(window.guardian.user.lastName));
    dispatch(setFullName(`${window.guardian.user.firstName} ${window.guardian.user.lastName}`));
    dispatch(setIsSignedIn(true));
  } else if (userAppearsLoggedIn) {
    fetch(routes.oneOffContribAutofill, { credentials: 'include' }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          if (data.id) {
            dispatch(setIsSignedIn(true));
            dispatch(setId(data.id));
          }
          if (data.name) {
            dispatch(setFullName(data.name));
          }
          if (data.email) {
            dispatch(setEmail(data.email));
          }
          if (data.displayName) {
            dispatch(setDisplayName(data.displayName));
          }
        });
      }
    });
  } else if (emailFromBrowser) {
    dispatch(setEmail(emailFromBrowser));
  }
};


// ----- Exports ----- //

export { init, isTestUser };
