// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type PaymentMethod, type PaymentHandler, getPaymentLabel } from 'helpers/checkouts';
import { type Contrib } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { setupStripeCheckout } from 'helpers/paymentIntegrations/newStripeCheckout';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';

import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';

import { type State } from '../contributionsLandingReducer';
import { type Action, updatePaymentMethod, isPaymentReady } from '../contributionsLandingActions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  countryId: IsoCountry,
  contributionType: Contrib,
  currency: IsoCurrency,
  paymentMethod: PaymentMethod,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  paymentHandler: { [PaymentMethod]: PaymentHandler | null },
  updatePaymentMethod: PaymentMethod => Action,
  isPaymentReady: (boolean, ?{ [PaymentMethod]: PaymentHandler }) => Action,
  isTestUser: boolean,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  countryId: state.common.internationalisation.countryId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  paymentHandler: state.page.form.paymentHandler,
  isTestUser: state.page.user.isTestUser || false,
});

const mapDispatchToProps = {
  updatePaymentMethod,
  isPaymentReady,
};

// ----- Logic ----- //

function setupPaymentMethod(props: PropTypes): void {
  const {
    paymentMethod,
    onPaymentAuthorisation,
    paymentHandler,
    contributionType,
    currency,
    isTestUser,
  } = props;

  if (!paymentHandler[paymentMethod]) {
    props.isPaymentReady(false);

    switch (paymentMethod) {
      case 'DirectDebit':
        // TODO
        break;

      case 'PayPal':
        // TODO
        break;

      case 'Stripe':
      default:
        setupStripeCheckout(onPaymentAuthorisation, contributionType, currency, isTestUser)
          .then((handler: PaymentHandler) => props.isPaymentReady(true, { Stripe: handler }));
    }
  }
}

// ----- Render ----- //

function ContributionPayment(props: PropTypes) {
  const paymentMethods: PaymentMethod[] = props.contributionType !== 'ONE_OFF' && props.countryId === 'GB'
    ? ['DirectDebit', 'Stripe', 'PayPal']
    : ['Stripe', 'PayPal'];

  setupPaymentMethod(props);

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
