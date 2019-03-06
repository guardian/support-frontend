// @flow

import React from 'react';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import type { PaymentMethod } from 'pages/digital-subscription-checkout/digitalSubscriptionCheckoutReducer';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { Fieldset } from 'components/forms/fieldset';
import { RadioInput } from 'components/forms/customFields/radioInput';
import Text from 'components/text/text';
import Rows from 'components/base/rows';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { getQueryParameter } from 'helpers/url';
import { type Option } from 'helpers/types/option';
import type { OptimizeExperiments } from 'helpers/optimize/optimize';

type PropTypes = {|
  countrySupportsDirectDebit: boolean,
  paymentMethod: Option<PaymentMethod>,
  onPaymentAuthorised: Function,
  setPaymentMethod: Function,
  optimizeExperiments: OptimizeExperiments,
|}

const isPayPalEnabled = (optimizeExperiments: OptimizeExperiments) => {
  const PayPalExperimentId = "Owuvo_-LQrywVTEhStTFvQ";
  const enabledByTest = optimizeExperiments.find((exp) => exp.id === PayPalExperimentId && exp.variant === '1');
  const enabledByQueryString = getQueryParameter('payPal') === 'true';
  return enabledByTest || enabledByQueryString;
};

function PaymentMethodSelector(props: PropTypes) {
  const payPalEnabled = isPayPalEnabled(props.optimizeExperiments);
  const multiplePaymentMethodsEnabled = payPalEnabled || props.countrySupportsDirectDebit;

  return (
    <FormSection title={multiplePaymentMethodsEnabled ? 'How would you like to pay?' : null}>
      <Rows gap="large">
        {multiplePaymentMethodsEnabled &&
        <div>
          <Fieldset legend="How would you like to pay?">
            {props.countrySupportsDirectDebit &&
            <RadioInput
              text="Direct debit"
              name="paymentMethod"
              checked={props.paymentMethod === 'DirectDebit'}
              onChange={() => props.setPaymentMethod('DirectDebit')}
            />}
            <RadioInput
              text="Credit/Debit card"
              name="paymentMethod"
              checked={props.paymentMethod === 'Stripe'}
              onChange={() => props.setPaymentMethod('Stripe')}
            />
            {payPalEnabled &&
            <RadioInput
              text="PayPal"
              name="paymentMethod"
              checked={props.paymentMethod === 'PayPal'}
              onChange={() => props.setPaymentMethod('PayPal')}
            />}
          </Fieldset>
        </div>
        }
        <div>
          <Text>
            <p>
              <strong>Money Back Guarantee.</strong>
              If you wish to cancel your subscription, we will send you
              a refund of the unexpired part of your subscription.
            </p>
            <p>
              <strong>Cancel any time you want.</strong>
              There is no set time on your agreement so you can stop
              your subscription anytime
            </p>
          </Text>
        </div>
      </Rows>
      <DirectDebitPopUpForm
        onPaymentAuthorisation={(pa: PaymentAuthorisation) => {
          props.onPaymentAuthorised(pa);
        }}
      />
    </FormSection>
  );
}

export { PaymentMethodSelector };
