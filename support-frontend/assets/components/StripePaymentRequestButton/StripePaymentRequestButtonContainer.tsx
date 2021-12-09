// ----- Imports ----- //
import { Elements } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import type { ContributionType } from 'helpers/contributions';
import {
	getStripeKey,
	stripeAccountForContributionType,
	useStripeObjects,
} from 'helpers/forms/stripe';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { isInStripePaymentRequestAllowedCountries } from 'helpers/internationalisation/country';
import type {
	PaymentRequestObject,
	RenderPaymentRequestButton,
} from './StripePaymentRequestButton';
import StripePaymentRequestButton from './StripePaymentRequestButton';

// ----- Types -----//

type PropTypes = {
	country: IsoCountry;
	isTestUser: boolean;
	contributionType: ContributionType;
	amount: number;
	renderPaymentRequestButton: RenderPaymentRequestButton;
	renderFallback?: () => JSX.Element;
};

interface PrbObjects {
	ONE_OFF: PaymentRequestObject;
	REGULAR: PaymentRequestObject;
}

// ----- Component ----- //

function StripePaymentRequestButtonContainer({
	country,
	contributionType,
	isTestUser,
	amount,
	renderPaymentRequestButton,
	renderFallback,
}: PropTypes): JSX.Element | null {
	// Maintain the PRB objects here because we must not re-create them when user switches between regular/one-off.
	// We have to create the PRB object inside the Elements component.
	const [prbObjects, setPrbObjects] = useState<PrbObjects>({
		ONE_OFF: { status: 'NOT_LOADED' },
		REGULAR: { status: 'NOT_LOADED' },
	});
	const stripeAccount = stripeAccountForContributionType[contributionType];
	const stripeKey = getStripeKey(stripeAccount, country, isTestUser);
	const stripeObjects = useStripeObjects(stripeAccount, stripeKey);
	const showStripePaymentRequestButton =
		isInStripePaymentRequestAllowedCountries(country);

	if (showStripePaymentRequestButton && stripeObjects[stripeAccount]) {
		// `options` must be set even if it's empty, otherwise we get 'Unsupported prop change on Elements' warnings
		// in the console
		const elementsOptions = {};

		/**
		 * The `key` attribute is necessary here because you cannot update the stripe object on the Elements.
		 * Instead, we create separate instances for ONE_OFF and REGULAR
		 */
		return (
			<div className="stripe-payment-request-button" key={stripeAccount}>
				<Elements
					stripe={stripeObjects[stripeAccount]}
					options={elementsOptions}
				>
					<StripePaymentRequestButton
						stripeAccount={stripeAccount}
						amount={amount}
						contributionType={contributionType}
						stripeKey={stripeKey}
						paymentRequestObject={prbObjects[stripeAccount]}
						setPaymentRequestObject={(prbObject) =>
							setPrbObjects({ ...prbObjects, [stripeAccount]: prbObject })
						}
						renderPaymentRequestButton={renderPaymentRequestButton}
						renderFallback={renderFallback}
					/>
				</Elements>
			</div>
		);
	}

	return null;
}

export default StripePaymentRequestButtonContainer;
