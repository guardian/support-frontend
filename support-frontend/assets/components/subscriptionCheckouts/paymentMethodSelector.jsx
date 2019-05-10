// @flow

import React from 'react';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import Rows from 'components/base/rows';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { type Option } from 'helpers/types/option';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal, Stripe } from 'helpers/paymentMethods';
import SvgDirectDebitSymbol from 'components/svgs/directDebitSymbol';
import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import type { ErrorReason } from 'helpers/errorReasons';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import { firstError } from 'helpers/subscriptionsForms/validation';
import type { FormField as DigitalPackFormField } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import type { FormField as AddressFormField } from 'pages/paper-subscription-checkout/paperSubscriptionCheckoutReducer';
import { withError } from 'hocs/withError';

type PropTypes = {|
  countrySupportsDirectDebit: boolean,
  paymentMethod: Option<PaymentMethod>,
  onPaymentAuthorised: Function,
  setPaymentMethod: Function,
  formErrors: FormError<DigitalPackFormField | AddressFormField>[],
  submissionError: ErrorReason | null,
  payPalEnabled: boolean,
|}

const FieldsetWithError = withError(Fieldset);

function PaymentMethodSelector(props: PropTypes) {
  const errorHeading = props.submissionError === 'personal_details_incorrect' ? 'Failed to Create Subscription' :
    'Payment Attempt Failed';
  const errorState = props.submissionError ?
    <GeneralErrorMessage errorReason={props.submissionError} errorHeading={errorHeading} /> :
    null;

  const multiplePaymentMethodsEnabled = props.payPalEnabled || props.countrySupportsDirectDebit;

  return (multiplePaymentMethodsEnabled ?
    <FormSection title={multiplePaymentMethodsEnabled ? 'How would you like to pay?' : null}>
      <Rows gap="large">
        {multiplePaymentMethodsEnabled &&
        <div>
          <FieldsetWithError
            id="payment-methods"
            legend="How would you like to pay?"
            error={firstError('paymentMethod', props.formErrors)}
          >
            {props.countrySupportsDirectDebit &&
            <RadioInput
              image={<SvgDirectDebitSymbol />}
              text="Direct debit"
              name="paymentMethod"
              checked={props.paymentMethod === DirectDebit}
              onChange={() => props.setPaymentMethod(DirectDebit)}
            />}
            <RadioInput
              image={<SvgNewCreditCard />}
              text="Credit/Debit card"
              name="paymentMethod"
              checked={props.paymentMethod === Stripe}
              onChange={() => props.setPaymentMethod(Stripe)}
            />
            {props.payPalEnabled &&
            <RadioInput
              image={<SvgPayPal />}
              text="PayPal"
              name="paymentMethod"
              checked={props.paymentMethod === PayPal}
              onChange={() => props.setPaymentMethod(PayPal)}
            />}
          </FieldsetWithError>
        </div>
        }
        {errorState}
      </Rows>
      <DirectDebitPopUpForm
        buttonText="Subscribe with Direct Debit"
        onPaymentAuthorisation={(pa: PaymentAuthorisation) => {
          props.onPaymentAuthorised(pa);
        }}
      />
    </FormSection>
    : null);
}

export { PaymentMethodSelector };
