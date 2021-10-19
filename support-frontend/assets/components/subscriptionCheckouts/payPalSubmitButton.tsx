// ----- Imports ----- //
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import 'helpers/internationalisation/currency';
import type { SetupPayPalRequestType } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import 'helpers/subscriptionsForms/validation';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import 'helpers/subscriptionsForms/formFields';
import { ErrorSummary } from './submitFormErrorSummary';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { PayPal } from 'helpers/forms/paymentMethods';
import { hiddenIf } from 'helpers/utilities/utilities';
import type { PayPalCheckoutDetails } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
const payPalButton = css`
	box-sizing: border-box;
	padding: ${space[3]}px;
`;
const showButton = css`
	max-width: 350px;
`;
const hideButton = css`
	display: none;
`;
// ----- Types ----- //
type PropTypes = {
	paymentMethod: Option<PaymentMethod>;
	currencyId: IsoCurrency;
	csrf: CsrfState;
	setupRecurringPayPalPayment: SetupPayPalRequestType;
	payPalHasLoaded: boolean;
	isTestUser: boolean;
	onPaymentAuthorised: (...args: Array<any>) => any;
	amount: number;
	billingPeriod: BillingPeriod;
	validateForm: (...args: Array<any>) => any;
	formIsValid: (...args: Array<any>) => any;
	allErrors: FormError<FormField>[];
};

// ----- Render ----- //
function PayPalSubmitButton(props: PropTypes) {
	// We have to show/hide PayPalExpressButton rather than conditionally rendering it
	// because we don't want to destroy and replace the iframe each time.
	// See PayPalExpressButton for more info.
	const onPayPalCheckoutCompleted = (
		payPalCheckoutDetails: PayPalCheckoutDetails,
	) =>
		props.onPaymentAuthorised({
			paymentMethod: PayPal,
			token: payPalCheckoutDetails.baid,
		});

	return (
		<div css={payPalButton}>
			<div css={props.paymentMethod === PayPal ? showButton : hideButton}>
				<div
					id="component-paypal-button-checkout"
					className={hiddenIf(
						props.paymentMethod !== PayPal,
						'component-paypal-button-checkout',
					)}
				>
					<PayPalExpressButton
						onPayPalCheckoutCompleted={onPayPalCheckoutCompleted}
						csrf={props.csrf}
						currencyId={props.currencyId}
						hasLoaded={props.payPalHasLoaded}
						canOpen={props.formIsValid}
						onClick={props.validateForm}
						formClassName="form--contribution"
						isTestUser={props.isTestUser}
						setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
						amount={props.amount}
						billingPeriod={props.billingPeriod}
					/>
				</div>
			</div>
			{props.paymentMethod === PayPal && (
				<span>
					{props.allErrors.length > 0 && (
						<ErrorSummary errors={props.allErrors} />
					)}
				</span>
			)}
		</div>
	);
}

export { PayPalSubmitButton };
