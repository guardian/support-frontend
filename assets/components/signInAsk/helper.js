// @flow

// ----- Imports ----- //
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';
import { fetchJson } from 'helpers/fetch';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import {logPromise} from "../../helpers/promise";

// ----- Functions ----- //

const requestData = (password: string, guestAccountRegistrationToken: string,  csrf: CsrfState) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
  credentials: 'same-origin',
  body: JSON.stringify({ password, guestAccountRegistrationToken }),
});

// Fire and forget, as we don't want to interrupt the flow
function setPasswordGuest(
  password: string,
  guestAccountRegistrationToken: string,
  csrf: CsrfState,
): Promise<boolean> {

  return logPromise(fetch(`${routes.contributionsSetPasswordGuest}`, requestData(password, guestAccountRegistrationToken, csrf)))
    .then((response) => {
      if (response.status === 200) {
        response.json().then(json => {
            //TODO: extract and set sign in cookies from json
          }
        );
        return true;
      } else {
        logException('/contribute/set-password-guest endpoint returned an error');
        return false;
      }
    })
    .catch(() => {
      logException('Error while trying to interact with /contribute/set-password-guest');
      return false
    });
}



// ----- Exports ----- //

export { setPasswordGuest };
