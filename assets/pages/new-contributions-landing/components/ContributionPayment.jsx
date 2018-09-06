// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type PaymentMethod } from 'helpers/checkouts';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';

import { type State } from '../contributionsLandingReducer';
import { type Action, updatePaymentMethod } from '../contributionsLandingActions';

// ----- Types ----- //

type PropTypes = {
  paymentMethod: PaymentMethod,
  updatePaymentMethod: PaymentMethod => Action,
};

const mapStateToProps = (state: State) => ({
  paymentMethod: state.page.paymentMethod,
});

const mapDispatchToProps = {
  updatePaymentMethod,
};

// ----- Render ----- //

function ContributionPayment(props: PropTypes) {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['buttons', 'contribution-pay'])}>
      <legend className={classNameWithModifiers('form__legend', ['radio-group'])}>Pay with</legend>

      <ul className="form__radio-group-list">
        <li className="form__radio-group-item">
          <input
            id="contributionPayment-card"
            className="form__radio-group-input"
            name="contributionPayment"
            type="radio"
            value="Stripe"
            onChange={() => props.updatePaymentMethod('Stripe')}
            checked={props.paymentMethod !== 'PayPal'}
          />
          <label htmlFor="contributionPayment-card" className="form__radio-group-label">
            <span className="radio-ui" />
            <span className="radio-ui__label">Credit/Debit Card</span>
            <SvgNewCreditCard />
          </label>
        </li>
        <li className="form__radio-group-item">
          <input
            id="contributionPayment-paypal"
            className="form__radio-group-input"
            name="contributionPayment"
            type="radio"
            value="PayPal"
            onChange={() => props.updatePaymentMethod('PayPal')}
            checked={props.paymentMethod === 'PayPal'}
          />
          <label htmlFor="contributionPayment-paypal" className="form__radio-group-label">
            <span className="radio-ui" />
            <span className="radio-ui__label">PayPal</span>
            <SvgPayPal />
          </label>
        </li>
      </ul>
    </fieldset>
  );
}

const NewContributionPayment = connect(mapStateToProps, mapDispatchToProps)(ContributionPayment);

export { NewContributionPayment };
