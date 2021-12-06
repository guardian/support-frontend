// ----- Imports ----- //
import { Elements } from '@stripe/react-stripe-js';
import type { PaymentRequest } from '@stripe/stripe-js';
import React, { useState } from 'react';
import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import {
	getStripeKey,
	stripeAccountForContributionType,
	useStripeObjects,
} from 'helpers/forms/stripe';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { isInStripePaymentRequestAllowedCountries } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { RenderPaymentRequestButton } from './StripePaymentRequestButton';
import StripePaymentRequestButton from './StripePaymentRequestButton';

// ----- Types -----//

type PropTypes = {
	country: IsoCountry;
	currency: IsoCurrency;
	isTestUser: boolean;
	contributionType: ContributionType;
	selectedAmounts: SelectedAmounts;
	otherAmounts: OtherAmounts;
	renderPaymentRequestButton: RenderPaymentRequestButton;
};

interface PrbObjects {
	ONE_OFF: PaymentRequest | null;
	REGULAR: PaymentRequest | null;
}

// ----- Component ----- //

function StripePaymentRequestButtonContainer(
	props: PropTypes,
): JSX.Element | null {
	// Maintain the PRB objects here because we must not re-create them when user switches between regular/one-off.
	// We have to create the PRB object inside the Elements component.
	const [prbObjects, setPrbObjects] = useState<PrbObjects>({
		ONE_OFF: null,
		REGULAR: null,
	});
	const stripeAccount =
		stripeAccountForContributionType[props.contributionType];
	const stripeKey = getStripeKey(
		stripeAccount,
		props.country,
		props.isTestUser,
	);
	const stripeObjects = useStripeObjects(stripeAccount, stripeKey);
	const showStripePaymentRequestButton =
		isInStripePaymentRequestAllowedCountries(props.country);

	if (showStripePaymentRequestButton && stripeObjects[stripeAccount]) {
		const amount = getAmount(
			props.selectedAmounts,
			props.otherAmounts,
			props.contributionType,
		);
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
						stripeKey={stripeKey}
						paymentRequestObject={prbObjects[stripeAccount]}
						setPaymentRequestObject={(prbObject) =>
							setPrbObjects({ ...prbObjects, [stripeAccount]: prbObject })
						}
						renderPaymentRequestButton={props.renderPaymentRequestButton}
					/>
				</Elements>
			</div>
		);
	}

	return null;
}

export default StripePaymentRequestButtonContainer;
