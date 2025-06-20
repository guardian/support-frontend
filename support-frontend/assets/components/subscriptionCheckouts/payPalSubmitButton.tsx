// ----- Imports ----- //

import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import type {
	PayPalCheckoutDetails,
	SetupPayPalRequestType,
} from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import type { PaymentAuthorisation } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { PayPal } from 'helpers/forms/paymentMethods';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type { FormField } from 'helpers/subscriptionsForms/formFields';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import { hiddenIf } from 'helpers/utilities/utilities';
import { ErrorSummary } from './submitFormErrorSummary';

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
	onPaymentAuthorised: (paymentAuth: PaymentAuthorisation) => void;
	amount: number;
	billingPeriod: BillingPeriod;
	validateForm: () => void;
	formIsValid: () => boolean;
	allErrors: Array<FormError<FormField>>;
};

// ----- Render ----- //
function PayPalSubmitButton(props: PropTypes): JSX.Element {
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
