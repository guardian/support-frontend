import { parseOrUndefined } from '@guardian/support-service-lambdas/modules/schemaUtils';
import type { CountryCode } from '@modules/internationalisation/country';
import { stateCodeSchema } from '@modules/internationalisation/schemas';
import type { StateCode } from '@modules/internationalisation/state';
import { useEffect } from 'react';
import { Country } from 'helpers/internationalisation/classes/country';

// ---- Example JSON ----
// {
//   "customer": {
//   "street": "Kings Place, York Way",
//     "state": "AR",
//     "salutation": null,
//     "postcode": "N1 9GU",
//     "lastName": "Mickey",
//     "firstName": "Mouse",
//     "email": "rupert.bates@thegulocal.com",
//     "country": "United States",
//     "city": "London"
// },
//   "csr": {
//   "lastName": "Bates",
//     "firstName": "Rupert"
// },
//   "caseId": "5009E00000J6QnmQAF"
// }

type SalesforceData = {
	customer: {
		salutation?: string;
		firstName?: string;
		lastName: string;
		email?: string;
		street?: string;
		city?: string;
		state?: string;
		postcode?: string;
		country?: string;
	};
	csr: { lastName: string; firstName: string };
	caseId: string;
};

export type CsrCustomerData = {
	customer: {
		title?: string;
		firstName?: string;
		lastName: string;
		email?: string;
		street?: string;
		city?: string;
		state?: StateCode;
		postcode?: string;
		country?: CountryCode;
	};
	csr: { lastName: string; firstName: string };
	caseId: string;
};

const domains = [
	'https://gnmtouchpoint--dev1--c.cs88.visual.force.com',
	'https://gnmtouchpoint--c.eu31.visual.force.com',
];

const isSalesforceDomain = (domain: string): boolean =>
	!!domains.find((element) => element === domain);

const parseCustomerData = (data: string): CsrCustomerData => {
	const salesforceData: SalesforceData = JSON.parse(data) as SalesforceData;
	const CountryCode = Country.findCountryCode(salesforceData.customer.country);
	const { salutation, ...otherData } = salesforceData.customer;
	const state = parseOrUndefined(stateCodeSchema, otherData.state);
	const customer = {
		...otherData,
		title: salutation,
		state,
		country: CountryCode ?? undefined,
	};
	return {
		csr: salesforceData.csr,
		customer: customer,
		caseId: salesforceData.caseId,
	};
};

const useCsrCustomerData = (
	callback: (csrCustomerData: CsrCustomerData) => void,
): void => {
	useEffect(() => {
		function checkForParentMessage(event: MessageEvent<string>) {
			if (isSalesforceDomain(event.origin)) {
				callback(parseCustomerData(event.data));
			}
		}

		window.addEventListener('message', checkForParentMessage);
		return () => window.removeEventListener('message', checkForParentMessage);
	}, []);
};

const csrUserName = (csrCustomerData: CsrCustomerData): string =>
	`${csrCustomerData.csr.firstName} ${csrCustomerData.csr.lastName}`;

export { useCsrCustomerData, csrUserName, parseCustomerData };
