import { useEffect, useState } from 'react';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { catchPromiseHandler } from 'helpers/utilities/promise';

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
	currency: IsoCurrency;
};

export function useLastOneOffContribution(
	isSignedIn: boolean,
): OneOffContribution | null {
	const [lastOneOffContribution, setlastOneOffContribution] =
		useState<OneOffContribution | null>(null);

	useEffect(() => {
		if (!isSignedIn) {
			return;
		}

		const fetchLatestOneOffContribution = async () => {
			const response = await fetch(MDAPI_URL, {
				mode: 'cors',
				credentials: 'include',
			});

			if (!response.ok) {
				return;
			}

			const data = (await response.json()) as MdapiOneOffContribution[];

			const sorted = data
				.filter((c) => c.status.toUpperCase() === 'PAID')
				.sort((c1, c2) => c2.created - c1.created);

			if (sorted.length >= 1) {
				const latest = sorted[0];

				setlastOneOffContribution({
					amount: latest.amount,
					createdAt: new Date(latest.created),
					currency: latest.currency,
				});
			}
		};

		fetchLatestOneOffContribution().catch(
			catchPromiseHandler('Error in fetchLatestOneOffContribution'),
		);
	}, []);
	return lastOneOffContribution;
}
