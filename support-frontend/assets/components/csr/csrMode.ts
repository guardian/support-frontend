import { useEffect, useState } from 'react';

export type CsrCustomerData = {
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

const domains = [
	'https://gnmtouchpoint.my.salesforce.com',
	'https://gnmtouchpoint--dev1--c.cs88.visual.force.com',
];

const isSalesforceDomain = (domain: string): boolean =>
	!!domains.find((element) => element === domain);

const isInCsrMode = (): boolean => window.location !== window.parent.location;

const useCsrCustomerData = (): CsrCustomerData | undefined => {
	const [csrCustomerData, setCsrCustomerData] = useState<
		CsrCustomerData | undefined
	>(undefined);

	useEffect(() => {
		function checkForParentMessage(event: MessageEvent) {
			if (isSalesforceDomain(event.origin)) {
				setCsrCustomerData(JSON.parse(event.data));
			}
		}

		window.addEventListener('message', checkForParentMessage);
		return () => window.removeEventListener('message', checkForParentMessage);
	}, []);
	return csrCustomerData;
};

const csrUserName = (csrCustomerData: CsrCustomerData) =>
	`${csrCustomerData.csr.firstName} ${csrCustomerData.csr.lastName}`;

export { isInCsrMode, useCsrCustomerData, isSalesforceDomain, csrUserName };
