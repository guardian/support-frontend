// @flow

// ----- Imports ----- //

import type { IdUserFromIdentity } from 'helpers/identityApis';
import { getUserFromIdentity } from 'helpers/identityApis';
import * as cookie from 'helpers/cookie';
import { get as getCookie } from 'helpers/cookie';
import { getSession } from 'helpers/storage';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import type { UserSetStateActions } from 'helpers/user/userActions';
import { getSignoutUrl } from 'helpers/externalLinks';


// ----- Functions ----- //

function isTestUser(): boolean {
  const isDefined = x => x !== null && x !== undefined;
  const uatMode = window.guardian && window.guardian.uatMode;
  const testCookie = cookie.get('_test_username');
  return isDefined(uatMode) || isDefined(testCookie);
}

const signOut = () => { window.location.href = getSignoutUrl(); };

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
    getUserFromIdentity().then((data: IdUserFromIdentity) => {
      if (data) {
        if (data.id) {
          dispatch(setIsSignedIn(true));
          dispatch(setId(data.id));
        }
        if (data.privateFields && data.privateFields.firstName) {
          dispatch(setFirstName(data.privateFields.firstName));
        }
        if (data.privateFields && data.privateFields.secondName) {
          dispatch(setLastName(data.privateFields.secondName));
        }
        if (data.primaryEmailAddress) {
          dispatch(setEmail(data.primaryEmailAddress));
        }
        if (data.publicFields && data.publicFields.displayName) {
          dispatch(setDisplayName(data.publicFields.displayName));
        }
      }
    });
  } else if (emailFromBrowser) {
    dispatch(setEmail(emailFromBrowser));
  }
};


// ----- Exports ----- //

export { init, isTestUser, signOut };
