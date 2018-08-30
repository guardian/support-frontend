// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type PaymentType } from 'helpers/contributions';

import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';

// ----- Types ----- //

type PropTypes = {
  paymentType: PaymentType,
};

// ----- Render ----- //

function ContributionPayment(props: PropTypes) {
  return (
    <fieldset className="form__radio-group form__radio-group--buttons form__radio-group--contribution-pay">
      <legend className="form__legend form__legend--radio-group">Pay with</legend>

      <ul className="form__radio-group__list">
        <li className="form__radio-group__item">
          <input
            id="contributionPayment-paypal"
            className="form__radio-group__input"
            name="contributionPayment"
            type="radio"
            value="paypal"
            checked={props.paymentType === 'paypal'}
          />
          <label htmlFor="contributionPayment-paypal" className="form__radio-group__label">
            <span className="radio-ui" />
            <span className="radio-ui__label">PayPal</span>
            <SvgPayPal />
          </label>
        </li>
        <li className="form__radio-group__item">
          <input
            id="contributionPayment-card"
            className="form__radio-group__input"
            name="contributionPayment"
            type="radio"
            value="card"
            checked={props.paymentType === 'card'}
          />
          <label htmlFor="contributionPayment-card" className="form__radio-group__label">
            <span className="radio-ui" />
            <span className="radio-ui__label">Credit/Debit Card</span>
            <SvgNewCreditCard />
          </label>
        </li>
      </ul>
    </fieldset>
  );
}

const mapStateToProps = () => ({
  paymentType: 'paypal',
});

const NewContributionPayment = connect(mapStateToProps)(ContributionPayment);

export { NewContributionPayment };
