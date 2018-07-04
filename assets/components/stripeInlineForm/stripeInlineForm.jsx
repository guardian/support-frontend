// @flow

// ----- Imports ----- //

import React from 'react';

import { StripeProvider, Elements, CardElement, injectStripe } from 'react-stripe-elements';
import { getStripeKey } from 'helpers/paymentIntegrations/stripeCheckout';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type Status } from 'helpers/switch';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import ErrorMessage from 'components/errorMessage/errorMessage';
import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import * as storage from 'helpers/storage';
import { classNameWithModifiers } from 'helpers/utilities';
import AnimatedDots from 'components/spinners/animatedDots';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  stripeIsLoaded: void => void,
  isStripeLoaded: boolean,
  currencyId: IsoCurrency,
  email: string,
  isTestUser: boolean,
  callback: (token: string) => Promise<*>,
  switchStatus: Status,
  canProceed: () => boolean,
  errorMessage: ?string,
  isPostDeploymentTestUser: boolean,
  setError: (message: string) => void,
  resetError: () => void,
  isSubmitButtonDisable: boolean,
  disableSubmitButton: () => void,
  enableSubmitButton: () => void,
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
    <StripeProvider apiKey={getStripeKey(props.currencyId, props.isTestUser)}>
      <Elements>
        <InjectedCheckoutForm
          callback={props.callback}
          currencyId={props.currencyId}
          isPostDeploymentTestUser={props.isPostDeploymentTestUser}
          canProceed={props.canProceed}
          errorMessage={props.errorMessage}
          setError={props.setError}
          resetError={props.resetError}
          email={props.email}
          isSubmitButtonDisable={props.isSubmitButtonDisable}
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
  isSubmitButtonDisable: boolean,
  disableSubmitButton: () => void,
  enableSubmitButton: () => void,
}) {

  const handleSubmit = (event) => {
    event.preventDefault();
    props.disableSubmitButton();

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
            props.enableSubmitButton();
          } else {
            props.resetError();
            props.callback(token.id);
          }

        });
    }
  };

  let className = '';
  let spinner = null;

  if (props.isSubmitButtonDisable) {
    className = classNameWithModifiers('component-stripe-inline-form__submit-payment', ['disabled']);
    spinner = <AnimatedDots />;
  } else {
    className = 'component-stripe-inline-form__submit-payment';
  }

  return (
    <form className="component-stripe-inline-form" onSubmit={handleSubmit}>
      <label>
        <span className="component-stripe-inline-form__label-content">Enter credit/debit card details</span>
        <CardElement className="component-stripe-inline-form__card-element" hidePostalCode style={stripeElementsStyle} />
      </label>
      <ErrorMessage message={props.errorMessage} />
      <button
        className={className}
        disabled={props.isSubmitButtonDisable}
      >
        Confirm card payment <SvgArrowRightStraight />
      </button> {spinner}
    </form>
  );
}

const InjectedCheckoutForm = injectStripe(checkoutForm);

// ----- Default props----- //

StripeInlineForm.defaultProps = {
  canProceed: () => true,
  switchStatus: 'On',
};

export default StripeInlineForm;
