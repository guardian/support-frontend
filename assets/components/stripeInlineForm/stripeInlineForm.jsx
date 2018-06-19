// @flow

// ----- Imports ----- //

import React from 'react';

import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import { type Currency } from 'helpers/internationalisation/currency';
import { type Status } from 'helpers/switch';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import ErrorMessage from 'components/errorMessage/errorMessage';
import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import * as storage from 'helpers/storage';


// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  stripeIsLoaded: void => void,
  isStripeLoaded: boolean,
  currency: Currency,
  email: string,
  isTestUser: boolean,
  callback: (token: string) => Promise<*>,
  switchStatus: Status,
  canProceed: () => boolean,
  errorMessage: ?string,
  isPostDeploymentTestUser: boolean,
  setError: (message: string) => void,
  resetError: () => void,
|};
/* eslint-enable react/no-unused-prop-types */


// ---- Auxiliary functions ----- //

const setupStripeInlineForm = (stripeIsLoaded: () => void) => {
  const htmlElement = document.getElementById('stripe-js');

  if (htmlElement !== null) {
    htmlElement.addEventListener(
      'load',
      stripeIsLoaded,
    );
  }
};


// ----- Component ----- //

function StripeInlineFormComp(props: PropTypes) {

  if (props.isStripeLoaded === false && window.Stripe === undefined) {
    setupStripeInlineForm(props.stripeIsLoaded);
    return null;
  }

  return (
    <StripeProvider apiKey={getStripeKey(props.currency.iso, props.isTestUser)}>
      <Elements>
        <InjectedCheckoutForm
          callback={props.callback}
          currency={props.currency}
          isPostDeploymentTestUser={props.isPostDeploymentTestUser}
          canProceed={props.canProceed}
          errorMessage={props.errorMessage}
          setError={props.setError}
          resetError={props.resetError}
          email={props.email}
        />
      </Elements>
    </StripeProvider>
  );
}

const StripeInlineForm = (props: PropTypes) => (
  <Switchable
    status={props.switchStatus}
    component={() => <StripeInlineFormComp {...props} />}
    fallback={() => <PaymentError paymentMethod="credit/debit card" />}
  />
);

// ----- Auxiliary components ----- //

const stripeElementsStyle = {
  base:
    {
      fontSize: '14px',
      fontFamily: '\'Guardian Text Sans Web\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\'',
      lineHeight: '40px',
    },
};

function checkoutForm(props: {
  stripe: Object,
  callback: (token: string) => mixed,
  isPostDeploymentTestUser: boolean,
  canProceed: () => boolean,
  errorMessage: ?string,
  setError: (string) => void,
  resetError: () => void,
  email: string,
}) {

  const handleSubmit = (event) => {
    event.preventDefault();

    // Don't open Stripe Checkout for automated tests, call the backend immediately
    if (props.isPostDeploymentTestUser) {
      const testTokenId = 'tok_visa';
      props.callback(testTokenId);
    } else if (props.canProceed && props.canProceed()) {
      storage.setSession('paymentMethod', 'Stripe');

      /*
       * We are passing the email in the name field here because in the StripeCheckout integration Stripe push the
       * user's email in their internal name field.
       */

      props
        .stripe
        .createToken({ name: props.email })
        .then(({ token, error }) => {
          if (error !== undefined) {
            props.setError(error.message);
          } else {
            props.resetError();
            props.callback(token.id);
          }

        });
    }
  };

  return (
    <form className="component-stripe-inline-form" onSubmit={handleSubmit}>
      <label>
        <span className="component-stripe-inline-form__label-content">Enter credit/debit card details</span>
        <CardElement className="component-stripe-inline-form__card-element" hidePostalCode style={stripeElementsStyle} />
      </label>
      <ErrorMessage message={props.errorMessage} />
      <button className="component-stripe-inline-form__submit-payment">Confirm card payment <SvgArrowRightStraight /></button>
    </form>);
}

const InjectedCheckoutForm = injectStripe(checkoutForm);

// ----- Default props----- //

StripeInlineForm.defaultProps = {
  canProceed: () => true,
  switchStatus: 'ON',
};

export default StripeInlineForm;
