// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

const checkAccount = (
  sortCode: string,
  accountNumber: string,
  isTestUser: boolean,
  csrf: CsrfState,
) => {

  const bankAccountInformation = {
    sortCode,
    accountNumber,
  };

  const requestData = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': csrf.token || '' },
    credentials: 'same-origin',
    body: JSON.stringify(bankAccountInformation),
  };

  return fetch(routes.directDebitCheckAccount, requestData);
};

export {
  checkAccount,
};
