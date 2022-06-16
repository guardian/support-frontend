import { useEffect } from 'preact/hooks';
import { useState } from 'react';
import { setupAmazonPay } from 'helpers/forms/paymentIntegrations/amazonPay/setup';
import type {
	AmazonLoginObject,
	AmazonPaymentsObject,
} from 'helpers/forms/paymentIntegrations/amazonPay/types';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

interface AmazonPayObjects {
	loginObject?: AmazonLoginObject;
	paymentsObject?: AmazonPaymentsObject;
}

export function useAmazonPayObjects(
	hasSelectedAmazonPay: boolean,
	countryGroupId: CountryGroupId,
	isTestUser: boolean,
): AmazonPayObjects {
	const [loginObject, setLoginObject] = useState<
		AmazonLoginObject | undefined
	>();

	const [paymentsObject, setPaymentsObject] = useState<
		AmazonPaymentsObject | undefined
	>();

	useEffect(() => {
		const hasLoaded = loginObject !== undefined || paymentsObject !== undefined;

		if (hasSelectedAmazonPay && !hasLoaded)
			setupAmazonPay(
				countryGroupId,
				setLoginObject,
				setPaymentsObject,
				isTestUser,
			);
	}, [hasSelectedAmazonPay]);

	return { loginObject, paymentsObject };
}
