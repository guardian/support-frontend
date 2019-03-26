// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

type CheckBankAccountDetails = {
  accountNumber: string,
  sortCode: string,
};

const checkAccount = (
  sortCode: string,
  accountNumber: string,
  isTestUser: boolean,
) => {

  const bankAccountDetails: CheckBankAccountDetails = {
    sortCode,
    accountNumber,
  };

  const requestData = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(bankAccountDetails),
  };

  return fetch(routes.directDebitCheckAccount, requestData);
};

export { checkAccount };
