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
import { withError } from 'hocs/withError';
import type { SubscriptionProduct } from 'helpers/subscriptions';
import { supportedPaymentMethods } from 'helpers/subscriptionsForms/countryPaymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';

type PropTypes = {|
  country: IsoCountry,
  paymentMethod: Option<PaymentMethod>,
  onPaymentAuthorised: Function,
  setPaymentMethod: Function,
  validationError: Option<string>,
  submissionError: Option<ErrorReason>,
  product: SubscriptionProduct,
|}

const FieldsetWithError = withError(Fieldset);

function PaymentMethodSelector(props: PropTypes) {
  const errorHeading = props.submissionError === 'personal_details_incorrect' ? 'Failed to Create Subscription' :
    'Payment Attempt Failed';
  const errorState = props.submissionError ?
    <GeneralErrorMessage errorReason={props.submissionError} errorHeading={errorHeading} /> :
    null;

  const paymentMethods = supportedPaymentMethods(props.country, props.product);


  return (paymentMethods.length > 1 ?
    <FormSection title="How would you like to pay?">
      <Rows gap="large">
        <div>
          <FieldsetWithError
            id="payment-methods"
            legend="How would you like to pay?"
            error={props.validationError}
          >
            {paymentMethods.includes(DirectDebit) &&
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
            {paymentMethods.includes(PayPal) &&
            <RadioInput
              image={<SvgPayPal />}
              text="PayPal"
              name="paymentMethod"
              checked={props.paymentMethod === PayPal}
              onChange={() => props.setPaymentMethod(PayPal)}
            />}
          </FieldsetWithError>
        </div>
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
