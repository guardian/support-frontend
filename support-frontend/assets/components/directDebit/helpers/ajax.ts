// ----- Imports ----- //
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
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
): Promise<Response> => {
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
