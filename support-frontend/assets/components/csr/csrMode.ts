import { useEffect } from 'react';
import type {
	CaState,
	IsoCountry,
	UsState,
} from 'helpers/internationalisation/country';
import { findIsoCountry } from 'helpers/internationalisation/country';

// ---- Example JSON ----
// {
//   "customer": {
//   "street": "Kings Place, York Way",
//     "state": "AR",
//     "salutation": null,
//     "postcode": "N1 9GU",
//     "lastName": "Mickey",
//     "firstName": "Mouse",
//     "email": "rupert.bates@gu.com",
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
		salutation: string | null;
		firstName: string | null;
		lastName: string;
		email: string | null;
		street: string | null;
		city: string | null;
		state: string | null;
		postcode: string | null;
		country: string | null;
	};
	csr: { lastName: string; firstName: string };
	caseId: string;
};

export type CsrCustomerData = {
	customer: {
		title: string | null;
		firstName: string | null;
		lastName: string;
		email: string | null;
		street: string | null;
		city: string | null;
		state: UsState | CaState | null;
		postcode: string | null;
		country: IsoCountry | null;
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
	const isoCountry = findIsoCountry(salesforceData.customer.country);
	const { salutation, ...otherData } = salesforceData.customer;
	const customer = {
		...otherData,
		title: salutation,
		country: isoCountry,
	};
	return {
		csr: salesforceData.csr,
		customer: customer,
		caseId: salesforceData.caseId,
	};
};

const useCsrCustomerData = (
	callback: (csrCustomerData: CsrCustomerData) => void,
) => {
	useEffect(() => {
		function checkForParentMessage(event: MessageEvent) {
			if (isSalesforceDomain(event.origin)) {
				callback(parseCustomerData(event.data));
			}
		}

		window.addEventListener('message', checkForParentMessage);
		return () => window.removeEventListener('message', checkForParentMessage);
	}, []);
};

const csrUserName = (csrCustomerData: CsrCustomerData) =>
	`${csrCustomerData.csr.firstName} ${csrCustomerData.csr.lastName}`;

export {
	useCsrCustomerData,
	isSalesforceDomain,
	csrUserName,
	parseCustomerData,
};
