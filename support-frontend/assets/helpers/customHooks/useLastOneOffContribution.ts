// @ts-expect-error - required for hooks
import { useEffect, useState } from 'react';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

const MDAPI_URL = `${window.guardian.mdapiUrl}/user-attributes/me/one-off-contributions`;
export type OneOffContribution = {
	amount: number;
	createdAt: Date;
	currency: IsoCurrency;
};
type MdapiOneOffContribution = {
	amount: number;
	created: number;
	status: string;
	currency: string;
};
export function useLastOneOffContribution(): OneOffContribution | null {
	const [lastOneOffContribution, setlastOneOffContribution] =
		useState<OneOffContribution | null>(null);
	useEffect(() => {
		fetch(MDAPI_URL, {
			mode: 'cors',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				const contributions = data as MdapiOneOffContribution[];
				const latest = contributions
					.filter((c) => c.status.toUpperCase() === 'PAID')
					.sort((c1, c2) => c2.created - c1.created)[0];

				if (latest) {
					setlastOneOffContribution({
						amount: latest.amount,
						createdAt: new Date(latest.created),
						currency: latest.currency,
					});
				}
			});
	}, []);
	return lastOneOffContribution;
}
