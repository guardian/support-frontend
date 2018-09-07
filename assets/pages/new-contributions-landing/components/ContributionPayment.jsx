// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type PaymentMethod, paymentMethodsPerCountryGroup, getPaymentLabel } from 'helpers/checkouts';
import { classNameWithModifiers } from 'helpers/utilities';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';

import { type State } from '../contributionsLandingReducer';
import { type Action, updatePaymentMethod } from '../contributionsLandingActions';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  paymentMethod: PaymentMethod,
  updatePaymentMethod: PaymentMethod => Action,
};

const mapStateToProps = (state: State) => ({
  paymentMethod: state.page.form.paymentMethod,
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
        {(paymentMethodsPerCountryGroup[props.countryGroupId] || paymentMethodsPerCountryGroup.default).map(paymentMethod => (
          <li className="form__radio-group-item">
            <input
              id={`contributionPayment-${paymentMethod}`}
              className="form__radio-group-input"
              name="contributionPayment"
              type="radio"
              value={paymentMethod}
              onChange={() => props.updatePaymentMethod(paymentMethod)}
              checked={props.paymentMethod === paymentMethod}
            />
            <label htmlFor={`contributionPayment-${paymentMethod}`} className="form__radio-group-label">
              <span className="radio-ui" />
              <span className="radio-ui__label">{getPaymentLabel(paymentMethod)}</span>
              {paymentMethod === 'PayPal' ? (<SvgPayPal />) : (<SvgNewCreditCard />)}
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

const NewContributionPayment = connect(mapStateToProps, mapDispatchToProps)(ContributionPayment);

export { NewContributionPayment };
