// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import { injectStripe, CardNumberElement, CardExpiryElement, CardCVCElement } from 'react-stripe-elements';
import { connect } from 'react-redux';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/paymentMethods';
import { type PaymentResult } from 'helpers/paymentIntegrations/readerRevenueApis';
import { setCreateStripePaymentMethod,
  setHandleStripe3DS,
  setStripeCardFormComplete,
  onThirdPartyPaymentAuthorised,
  paymentFailure,
  paymentWaiting,
  type Action } from 'pages/contributions-landing/contributionsLandingActions';
import { type ContributionType } from 'helpers/contributions';
import type { ErrorReason } from 'helpers/errorReasons';
import { logException } from 'helpers/logger';
import { trackComponentLoad } from 'helpers/tracking/behaviour';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  stripe: Object, // Available through the injectStripe 'Higher-Order Component'
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
  paymentFailure: (paymentError: ErrorReason) => Action,
  contributionType: ContributionType,
  setCreateStripePaymentMethod: ((email: string) => void) => Action,
  setHandleStripe3DS: ((clientSecret: string) => void) => Action,
  paymentWaiting: (isWaiting: boolean) => Action,
  setStripeCardFormComplete: (isComplete: boolean) => Action,
|};

const mapStateToProps = (state: State) => ({
  contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: Function) => ({
  onPaymentAuthorised:
    (paymentAuthorisation: PaymentAuthorisation) =>
      dispatch(onThirdPartyPaymentAuthorised(paymentAuthorisation)),
  paymentFailure: (paymentError: ErrorReason) => dispatch(paymentFailure(paymentError)),
  setCreateStripePaymentMethod: (createStripePaymentMethod: (email: string) => void) =>
    dispatch(setCreateStripePaymentMethod(createStripePaymentMethod)),
  setHandleStripe3DS: (handleStripe3DS: (clientSecret: string) => void) =>
    dispatch(setHandleStripe3DS(handleStripe3DS)),
  setStripeCardFormComplete: (isComplete: boolean) =>
    dispatch(setStripeCardFormComplete(isComplete)),
  paymentWaiting: (isWaiting: boolean) =>
    dispatch(paymentWaiting(isWaiting)),
});

type CardFieldError = { errorMessage: string }
type CardFieldState = 'Incomplete' | CardFieldError | 'Complete';
type CardFieldName = 'CardNumber' | 'Expiry' | 'CVC';

type StateTypes = {
  [CardFieldName]: CardFieldState,
  currentlySelected: CardFieldName | null,
};

const fieldStyle = {
  base: {
    fontFamily: '\'Guardian Text Sans Web\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
  },
};

class CardForm extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      CardNumber: 'Incomplete',
      Expiry: 'Incomplete',
      CVC: 'Incomplete',
      currentlySelected: null,
    };
  }

  componentDidMount(): void {
    this.props.setCreateStripePaymentMethod((email: string) => {
      this.props.paymentWaiting(true);

      this.props.stripe.createPaymentMethod('card', {
        billing_details: { email },
      }).then((result) => {
        if (result.error) {
          this.props.paymentWaiting(false);

          logException(`Error creating Payment Method: ${result.error}`);

          if (result.error.type === 'validation_error') {
            // This shouldn't be possible as we disable the submit button until all fields are valid, but if it does
            // happen then display a generic error about card details
            this.props.paymentFailure('payment_details_incorrect');
          } else {
            // This is probably a Stripe or network problem
            this.props.paymentFailure('payment_provider_unavailable');
          }
        } else {
          this.props.onPaymentAuthorised({
            paymentMethod: Stripe,
            stripePaymentMethod: 'StripeCheckout',
            paymentMethodId: result.paymentMethod.id
          });
        }
      });
    });

    this.props.setHandleStripe3DS((clientSecret: string) => {
      trackComponentLoad('stripe-3ds');
      return this.props.stripe.handleCardAction(clientSecret);
    });
  }

  onChange = (fieldName: CardFieldName) => (update) => {
    let newFieldState = 'Incomplete';

    if (update.error) { newFieldState = { errorMessage: update.error.message }; } else if (update.complete) { newFieldState = 'Complete'; }

    this.setState(
      { [fieldName]: newFieldState },
      () => this.props.setStripeCardFormComplete(this.formIsComplete()),
    );
  };

  onFocus = (fieldName: CardFieldName) => {
    this.setState({
      currentlySelected: fieldName,
    });
  };

  onBlur = () => {
    this.setState({
      currentlySelected: null,
    });
  };

  formIsComplete = () =>
    this.state.CardNumber === 'Complete' &&
    this.state.Expiry === 'Complete' &&
    this.state.CVC === 'Complete';

  render() {
    const errorMessage =
      this.state.CardNumber.errorMessage ||
      this.state.Expiry.errorMessage ||
      this.state.CVC.errorMessage;

    const getClasses = (fieldName: CardFieldName): string =>
      `form__input ${this.state.currentlySelected === fieldName ? 'form__input-enabled' : ''}`;

    return (
      <div className="form__fields">
        <legend className="form__legend">Your card details</legend>

        <div className="form__field">
          <label className="form__label" htmlFor="stripeCardNumberElement">
            <span>Card number</span>
          </label>
          <span className={getClasses('CardNumber')}>
            <CardNumberElement
              id="stripeCardNumberElement"
              style={fieldStyle}
              onChange={this.onChange('CardNumber')}
              onFocus={() => this.onFocus('CardNumber')}
              onBlur={this.onBlur}
            />
          </span>
        </div>

        <div className="stripe-card-element-container__inline-fields">
          <div className="form__field">
            <label className="form__label" htmlFor="stripeCardExpiryElement">
              <span>Expiry date</span>
            </label>
            <span className={getClasses('Expiry')}>
              <CardExpiryElement
                id="stripeCardExpiryElement"
                style={fieldStyle}
                onChange={this.onChange('Expiry')}
                onFocus={() => this.onFocus('Expiry')}
                onBlur={this.onBlur}
              />
            </span>
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="stripeCardCVCElement">
              <span>CVC</span>
            </label>
            <span className={getClasses('CVC')}>
              <CardCVCElement
                id="stripeCardCVCElement"
                style={fieldStyle}
                placeholder=""
                onChange={this.onChange('CVC')}
                onFocus={() => this.onFocus('CVC')}
                onBlur={this.onBlur}
              />
            </span>
          </div>
        </div>

        {errorMessage ? <div className="form__error">{errorMessage}</div> : null}
      </div>
    );
  }
}

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
