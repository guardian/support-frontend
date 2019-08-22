// @flow

// ----- Imports ----- //

import React, { Component } from 'react';
import {CardElement, injectStripe, CardNumberElement, CardExpiryElement, CardCVCElement} from 'react-stripe-elements';
import {connect} from "react-redux";
import type {State} from "assets/pages/contributions-landing/contributionsLandingReducer";
import {onThirdPartyPaymentAuthorised, paymentWaiting, StripeCardFormField} from "../../contributionsLandingActions";
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { Stripe } from 'helpers/paymentMethods';
import {type PaymentResult} from 'helpers/paymentIntegrations/readerRevenueApis';
import {setCreateStripePaymentMethod, setHandleStripe3DS, setStripeCardFormComplete} from 'pages/contributions-landing/contributionsLandingActions';
import {type ContributionType} from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { type ThirdPartyPaymentLibrary } from 'helpers/checkouts';
import type {Action} from "../../contributionsLandingActions";

// ----- Types -----//

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  onPaymentAuthorised: (PaymentAuthorisation) => Promise<PaymentResult>,
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
        //TODO - error handling
        console.log("paymentMethod", result)
        this.props.onPaymentAuthorised({paymentMethod: Stripe, paymentMethodId: result.paymentMethod.id})
      });
    });

    this.props.setHandleStripe3DS((clientSecret: string) => {
      return this.props.stripe.handleCardAction(clientSecret).then(result => {
        console.log("handle3DS", result)
        return result.paymentIntent
      })
    });
  }

  formIsComplete = () =>
    this.state.CardNumber === 'Complete' &&
    this.state.Expiry === 'Complete' &&
    this.state.CVC === 'Complete';

  onChange = (fieldName: CardFieldName) => (update) => {
    console.log(fieldName, update)
    let newFieldState = 'Incomplete';

    if (update.error) newFieldState = { errorMessage: update.error.message };
    else if (update.complete) newFieldState = 'Complete';

    this.setState(
      { [fieldName]: newFieldState },
      () => this.props.setStripeCardFormComplete(this.formIsComplete())
    );
  };

  render() {
    const errorMessage =
      this.state.CardNumber.errorMessage ||
      this.state.Expiry.errorMessage ||
      this.state.CVC.errorMessage;

    console.log(this.state)
    return (
      <div className='form__field'>
        <label className="form__label">
          <span>Your card details</span>
        </label>

        <CardNumberElement
          placeholder="Card Number"
          onChange={this.onChange('CardNumber')}
        />
        <CardExpiryElement onChange={this.onChange('Expiry')}/>
        <CardCVCElement onChange={this.onChange('CVC')}/>

        {errorMessage ? <div className='form__error'>{errorMessage}</div> : null}
      </div>
    )
  }
}

// ----- Default props----- //

const StripeCardForm =
  injectStripe(connect(mapStateToProps, mapDispatchToProps)(CardForm));

export default StripeCardForm;
