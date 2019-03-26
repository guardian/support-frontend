// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';

type CheckBankAccountDetails = {
  accountNumber: string,
  sortCode: string,
};

const checkAccount = (
  sortCode: string,
  accountNumber: string,
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
