// @flow

// ----- Imports ----- //
import { routes } from 'helpers/routes';
import { logException } from 'helpers/logger';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { logPromise } from 'helpers/promise';

// ----- Functions ----- //

const requestData = (password: string, guestAccountRegistrationToken: string, csrf: CsrfState) => ({
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
  credentials: 'same-origin',
  body: JSON.stringify({ password, guestAccountRegistrationToken }),
});

function setPasswordGuest(
  password: string,
  guestAccountRegistrationToken: string,
  csrf: CsrfState,
): Promise<boolean> {

  return logPromise(fetch(`${routes.contributionsSetPasswordGuest}`, requestData(password, guestAccountRegistrationToken, csrf)))
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
      logException('/contribute/set-password-guest endpoint returned an error');
      return false;

    })
    .catch(() => {
      logException('Error while trying to interact with /contribute/set-password-guest');
      return false;
    });
}


// ----- Exports ----- //

export { setPasswordGuest };