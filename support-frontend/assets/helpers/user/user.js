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

const isPostDeployUser = (): boolean =>
  cookie.get('_post_deploy_user') === 'true';

const signOut = () => { window.location.href = getSignoutUrl(); };

const doesUserAppearToBeSignedIn = () => !!cookie.get('GU_U');

// JTL: The user cookie is built to have particular values at
// particular indices by design. Index 7 in the cookie object represents
// whether a signed in user is validated or not. Though it's not ideal
// to grab values at unnamed indexes, this is a decision made a long
// time ago, on which a lot of other code relies, so it's unlikely
// there will be a breaking change affecting our base without some advance
// communication to a broader segment of engineering that also uses
// the user cookie.
const getEmailValidatedFromUserCookie = (guuCookie: ?string) => {
  if (guuCookie) {
    const tokens = guuCookie.split('.');
    try {
      const parsed = JSON.parse(atob(tokens[0]));
      return !!parsed[7];
    } catch (e) {
      return false;
    }
  }

  return false;
};

const init = (dispatch: Function, actions: UserSetStateActions = defaultUserActionFunctions) => {

  const {
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
    setEmailValidated,
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

  if (isTestUser() && isPostDeployUser()) {
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
    // default value from Identity Billing Address, or Fastly GEO-IP
    dispatch(setStateField(window.guardian.user.address4 || window.guardian.geoip.stateCode));
    dispatch(setIsSignedIn(true));
    dispatch(setEmailValidated(getEmailValidatedFromUserCookie(cookie.get('GU_U'))));
  } else if (userAppearsLoggedIn) { // TODO - remove in another PR as this condition is deprecated
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
    dispatch(setStateField(window.guardian.geoip.stateCode));
  } else {
    dispatch(setStateField(window.guardian.geoip.stateCode));
  }
};


// ----- Exports ----- //

export {
  init,
  getUser,
  isTestUser,
  isPostDeployUser,
  signOut,
  doesUserAppearToBeSignedIn,
  getEmailValidatedFromUserCookie,
};
