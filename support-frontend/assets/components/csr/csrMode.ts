import { useEffect } from 'react';
import type {
	CaState,
	IsoCountry,
	UsState,
} from 'helpers/internationalisation/country';
import {
	findIsoCountry,
	stateProvinceFromFullName,
} from 'helpers/internationalisation/country';

// ---- Example JSON ----
// {
//   "title": null,
//   "street": "Kings Place, York Way",
//   "state": "Arkansas",
//   "postcode": "N1 9GU",
//   "lastName": "Mouse",
//   "firstName": "Mickey",
//   "email": "rupert.bates@gu.com",
//   "country": "United States",
//   "city": "London"
// }
type SalesforceData = {
	customer: {
		title: string | null;
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
};

const domains = [
	'https://gnmtouchpoint.my.salesforce.com',
	'https://gnmtouchpoint--dev1--c.cs88.visual.force.com',
];

const isSalesforceDomain = (domain: string): boolean =>
	!!domains.find((element) => element === domain);

const isInCsrMode = (): boolean => window.location !== window.parent.location;

const parseCustomerData = (data: string): CsrCustomerData => {
	const salesforceData: SalesforceData = JSON.parse(data) as SalesforceData;
	const isoCountry = findIsoCountry(salesforceData.customer.country);
	const state =
		isoCountry &&
		salesforceData.customer.state &&
		stateProvinceFromFullName(isoCountry, salesforceData.customer.state);
	const customer = {
		...salesforceData.customer,
		state: state ?? null,
		country: isoCountry,
	};
	return {
		csr: salesforceData.csr,
		customer: customer,
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
	isInCsrMode,
	useCsrCustomerData,
	isSalesforceDomain,
	csrUserName,
	parseCustomerData,
};
