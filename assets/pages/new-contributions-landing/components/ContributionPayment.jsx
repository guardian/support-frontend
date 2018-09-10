// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type PaymentMethod, getPaymentLabel } from 'helpers/checkouts';
import { type Contrib } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';

import { type State } from '../contributionsLandingReducer';
import { type Action, updatePaymentMethod } from '../contributionsLandingActions';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  countryId: IsoCountry,
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  updatePaymentMethod: PaymentMethod => Action, // eslint-disable-line react/no-unused-prop-types
};

const mapStateToProps = (state: State) => ({
  countryId: state.common.internationalisation.countryId,
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
});

const mapDispatchToProps = {
  updatePaymentMethod,
};

// ----- Render ----- //

function ContributionPayment(props: PropTypes) {
  const paymentMethods: PaymentMethod[] = props.contributionType !== 'ONE_OFF' && props.countryId === 'GB'
    ? ['Stripe', 'DirectDebit', 'PayPal']
    : ['Stripe', 'PayPal'];

  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['buttons', 'contribution-pay'])}>
      <legend className="form__legend">Payment method</legend>

      <ul className="form__radio-group-list">
        {paymentMethods.map(paymentMethod => (
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
