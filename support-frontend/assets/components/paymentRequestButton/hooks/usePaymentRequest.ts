import type {
	CanMakePaymentResult,
	PaymentRequest,
	Stripe as StripeJs,
} from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import {
	getAvailablePaymentRequestButtonPaymentMethod,
	toHumanReadableContributionType,
} from 'helpers/forms/checkouts';
import type { StripePaymentMethod } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { trackComponentInsert } from 'helpers/tracking/behaviour';

type PaymentRequestButtonType = 'APPLE_PAY' | 'GOOGLE_PAY' | 'PAY_NOW' | 'NONE';

type PaymentRequestData = {
	buttonType: PaymentRequestButtonType;
	paymentRequest: PaymentRequest | null;
	internalPaymentMethodName: StripePaymentMethod | null;
};

function buttonTypeFromResult(
	result: CanMakePaymentResult,
): PaymentRequestButtonType {
	if (result.applePay) {
		return 'APPLE_PAY';
	}

	if (result.googlePay) {
		return 'GOOGLE_PAY';
	}

	return 'PAY_NOW';
}

// Orchestrates the entire payment request process via Stripe
export function usePaymentRequest(stripe: StripeJs | null): PaymentRequestData {
	const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
		null,
	);
	// This is only used for tracking purposes
	const [internalPaymentMethodName, setInternalPaymentMethodName] =
		useState<StripePaymentMethod | null>(null);

	const [buttonType, setButtonType] =
		useState<PaymentRequestButtonType>('NONE');

	const { countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const amount = useContributionsSelector(getUserSelectedAmount);

	// Check if we can use the PRB once the Stripe SDK is available
	useEffect(() => {
		if (stripe && !Number.isNaN(amount)) {
			const paymentRequestSdk = stripe.paymentRequest({
				country: countryId,
				currency: currencyId.toLowerCase(),
				total: {
					label: `${toHumanReadableContributionType(
						contributionType,
					)} Contribution`,
					amount: amount * 100,
				},
				requestPayerEmail: true,
				requestPayerName: contributionType !== 'ONE_OFF',
			});

			void paymentRequestSdk.canMakePayment().then((result) => {
				const paymentMethod = getAvailablePaymentRequestButtonPaymentMethod(
					result,
					contributionType,
				);
				if (result && paymentMethod) {
					const buttonType = buttonTypeFromResult(result);
					trackComponentInsert(`${paymentMethod}-${buttonType}`);
					setPaymentRequest(paymentRequestSdk);
					setInternalPaymentMethodName(paymentMethod);
					setButtonType(buttonType);
				}
			});
		}
	}, [stripe]);

	// Update the PR object when the amount or currency changes
	useEffect(() => {
		if (paymentRequest && !Number.isNaN(amount)) {
			paymentRequest.update({
				currency: currencyId.toLowerCase(),
				total: {
					label: `${toHumanReadableContributionType(
						contributionType,
					)} Contribution`,
					amount: amount * 100,
				},
			});
		}
	}, [amount, currencyId]);

	return {
		buttonType,
		paymentRequest,
		internalPaymentMethodName,
	};
}
