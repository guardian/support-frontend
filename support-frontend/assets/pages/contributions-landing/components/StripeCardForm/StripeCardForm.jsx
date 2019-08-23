// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import {injectStripe, CardNumberElement, CardExpiryElement, CardCVCElement} from 'react-stripe-elements';
import {connect} from "react-redux";
import type {State} from "assets/pages/contributions-landing/contributionsLandingReducer";
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/paymentMethods';
import {type PaymentResult} from 'helpers/paymentIntegrations/readerRevenueApis';
import {
  setCreateStripePaymentMethod,
  setHandleStripe3DS,
  setStripeCardFormComplete,
  onThirdPartyPaymentAuthorised,
  paymentFailure,
  paymentWaiting,
  StripeCardFormField,
  type Action} from 'pages/contributions-landing/contributionsLandingActions';
import {type ContributionType} from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { type ThirdPartyPaymentLibrary } from 'helpers/checkouts';
import type { ErrorReason } from 'helpers/errorReasons';
import { logException } from 'helpers/logger';

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
  paymentFailure: (paymentError: ErrorReason) => Action,
  contributionType: ContributionType,
  setCreateStripePaymentMethod: ((email: string) => void) => Action,
  setHandleStripe3DS: ((clientSecret: string) => void) => Action,
  paymentWaiting: (isWaiting: boolean) => Action,
  errorMessage: string | null,

  setStripeCardFormComplete: (isComplete: boolean) => Action,
|};

const mapStateToProps = (state: State) => ({
  contributionType: state.page.form.contributionType,
  errorMessage: state.page.form.stripePaymentIntentsData.errorMessage
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
    dispatch(paymentWaiting(isWaiting))
});

type CardFieldError = { errorMessage: string }

type CardFieldState = 'Incomplete' | CardFieldError | 'Complete';

type CardFieldName = 'CardNumber' | 'Expiry' | 'CVC';

type StateTypes = {
  [CardFieldName]: CardFieldState,
};

class CardForm extends Component<PropTypes, StateTypes> {

  constructor(props: PropTypes) {
    super(props);
    
    this.state = {
      CardNumber: 'Incomplete',
      Expiry: 'Incomplete',
      CVC: 'Incomplete',
    }
  }

  componentDidMount(): void {
    this.props.setCreateStripePaymentMethod((email: string) => {
      this.props.paymentWaiting(true);

      this.props.stripe.createPaymentMethod('card', {
        billing_details: {email}
      }).then(result => {
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
        }
        else {
          this.props.onPaymentAuthorised({paymentMethod: Stripe, paymentMethodId: result.paymentMethod.id})
        }
      });
    });

    this.props.setHandleStripe3DS((clientSecret: string) => this.props.stripe.handleCardAction(clientSecret));
  }

  formIsComplete = () =>
    this.state.CardNumber === 'Complete' &&
    this.state.Expiry === 'Complete' &&
    this.state.CVC === 'Complete';

  onChange = (fieldName: CardFieldName) => (update) => {
    let newFieldState = 'Incomplete';

    if (update.error) newFieldState = { errorMessage: update.error.message };
    else if (update.complete) newFieldState = 'Complete';

    this.setState(
      { [fieldName]: newFieldState },
      () => this.props.setStripeCardFormComplete(this.formIsComplete())
    );
  };

  fieldStyle = {
    base: {
      fontFamily: "'Guardian Text Sans Web', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
      border: "0.0625rem solid #00b2ff",
      boxShadow: "0 0 0 2px #00b2ff",
      fontSize: "16px",
      ":focus": {
        boxShadow: "0 0 0 2px #00b2ff"
      }
    }
  };

  render() {
    const errorMessage =
      this.state.CardNumber.errorMessage ||
      this.state.Expiry.errorMessage ||
      this.state.CVC.errorMessage;

    return (
      <div className='form__fields'>
        <legend className='form__legend'>Your card details</legend>

        <div className='form__field'>
          <label className="form__label">
            <span>Card number</span>
          </label>
          <span className='form__input'>
            <CardNumberElement
              style={this.fieldStyle}
              onChange={this.onChange('CardNumber')}
            />
          </span>
        </div>

        <div className='stripe-card-element-container__inline-fields'>
          <div className='form__field'>
            <label className="form__label">
              <span>Expiry date</span>
            </label>
            <span className='form__input'>
              <CardExpiryElement
                style={this.fieldStyle}
                onChange={this.onChange('Expiry')}
              />
            </span>
          </div>

          <div className='form__field'>
            <label className="form__label">
              <span>CVC</span>
            </label>
            <span className='form__input'>
              <CardCVCElement
                style={this.fieldStyle}
                placeholder=''
                onChange={this.onChange('CVC')}
              />
            </span>
          </div>
        </div>

        {errorMessage ? <div className='form__error'>{errorMessage}</div> : null}
      </div>
    )
  }
}

// ----- Default props----- //

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
