// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';
import * as cookie from 'helpers/cookie';
import { get as getCookie } from 'helpers/cookie';
import { getSession } from 'helpers/storage';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import type { UserSetStateActions } from 'helpers/user/userActions';
import { getSignoutUrl } from 'helpers/externalLinks';
import type { Option } from 'helpers/types/option';

export type User = {|
  firstName: Option<string>,
  lastName: Option<string>,
  email: Option<string>,
|};


// ----- Functions ----- //

function getUser(): User {

  if (window && window.guardian && window.guardian.user) {

    const {
      firstName, lastName, email,
    } = window.guardian.user;

    return {
      firstName: typeof firstName === 'string' ? firstName : null,
      lastName: typeof lastName === 'string' ? lastName : null,
      email: typeof email === 'string' ? email : null,
    };
  }

  return {
    firstName: null,
    lastName: null,
    email: null,
  };

}


function isTestUser(): boolean {
  const isDefined = x => x !== null && x !== undefined;
  const uatMode = window.guardian && window.guardian.uatMode;
  const testCookie = cookie.get('_test_username');
  return isDefined(uatMode) || isDefined(testCookie);
}

const signOut = () => { window.location.href = getSignoutUrl(); };

const doesUserAppearToBeSignedIn = () => !!cookie.get('GU_U');

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
  const userAppearsLoggedIn = doesUserAppearToBeSignedIn();

  function getEmailFromBrowser(): ?string {
    if (window.guardian && window.guardian.email) {
      return window.guardian.email;
    }
    return getSession('gu.email');
  }

  const emailFromBrowser = getEmailFromBrowser();

  /*
   * Prevent use of the test stripe token if user is logged in, as support-workers will try it in live mode
   * if the identity cookie is present
   */
  const emailMatchesTestUser = (): boolean => {
    const testUsername = cookie.get('_test_username');
    if (emailFromBrowser && testUsername) {
      return emailFromBrowser.toLowerCase().startsWith(testUsername.toLowerCase());
    }
    return false;
  };

  if (isTestUser() && (!userAppearsLoggedIn || emailMatchesTestUser())) {
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

export {
  init,
  getUser,
  isTestUser,
  signOut,
  doesUserAppearToBeSignedIn,
};
