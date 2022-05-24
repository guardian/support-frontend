// ----- Imports ----- //
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { routes } from 'helpers/urls/routes';

type CheckBankAccountDetails = {
	accountNumber: string;
	sortCode: string;
};

const checkAccount = (
	sortCode: string,
	accountNumber: string,
	_isTestUser: boolean,
	csrf: CsrfState,
) => {
	const bankAccountDetails: CheckBankAccountDetails = {
		sortCode,
		accountNumber,
	};
	const requestData: RequestInit = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Csrf-Token': csrf.token ?? '',
		},
		credentials: 'same-origin',
		body: JSON.stringify(bankAccountDetails),
	};
	return fetch(routes.directDebitCheckAccount, requestData);
};

export { checkAccount };
