// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type ThirdPartyPaymentLibrary, getPaymentLabel, getValidPaymentMethods } from 'helpers/checkouts';
import { type Switches } from 'helpers/settings';
import {
  type ContributionType,
  type ThirdPartyPaymentLibraries,
} from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';
import SvgDirectDebitSymbol from 'components/svgs/directDebitSymbol';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';

import { type State } from '../contributionsLandingReducer';
import { type Action, updatePaymentMethod, setThirdPartyPaymentLibrary } from '../contributionsLandingActions';
import type { PaymentMethod } from 'helpers/paymentMethods';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  countryId: IsoCountry,
  contributionType: ContributionType,
  currency: IsoCurrency,
  paymentMethod: PaymentMethod,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  thirdPartyPaymentLibraries: ThirdPartyPaymentLibraries,
  updatePaymentMethod: PaymentMethod => Action,
  setThirdPartyPaymentLibrary: (?{ [ContributionType]: { [PaymentMethod]: ThirdPartyPaymentLibrary }}) => Action,
  isTestUser: boolean,
  switches: Switches,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  countryId: state.common.internationalisation.countryId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  thirdPartyPaymentLibraries: state.page.form.thirdPartyPaymentLibraries,
  isTestUser: state.page.user.isTestUser || false,
  switches: state.common.settings.switches,
});

const mapDispatchToProps = {
  updatePaymentMethod,
  setThirdPartyPaymentLibrary,
};

// ----- Render ----- //

function getPaymentMethodLogo(paymentMethod: PaymentMethod) {
  switch (paymentMethod) {
    case 'PayPal':
      return <SvgPayPal />;
    case 'DirectDebit':
      return <SvgDirectDebitSymbol />;
    default:
      return <SvgNewCreditCard />;
  }
}

function PaymentMethodSelector(props: PropTypes) {

  const paymentMethods: PaymentMethod[] =
    getValidPaymentMethods(props.contributionType, props.switches, props.countryId);

  const noPaymentMethodsErrorMessage = <GeneralErrorMessage classModifiers={['no-valid-payments']} errorHeading="Payment methods are unavailable" errorReason="all_payment_methods_unavailable" />;

  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['buttons', 'contribution-pay'])}>
      <legend className="form__legend">Payment method</legend>

      { paymentMethods.length ?
        <ul className="form__radio-group-list">
          {paymentMethods.map(paymentMethod => (
            <li className="form__radio-group-item">
              <input
                id={`paymentMethodSelector-${paymentMethod}`}
                className="form__radio-group-input"
                name="paymentMethodSelector"
                type="radio"
                value={paymentMethod}
                onChange={() => props.updatePaymentMethod(paymentMethod)}
                checked={props.paymentMethod === paymentMethod}
              />
              <label htmlFor={`paymentMethodSelector-${paymentMethod}`} className="form__radio-group-label">
                <span className="radio-ui" />
                <span className="radio-ui__label">{getPaymentLabel(paymentMethod)}</span>
                {getPaymentMethodLogo(paymentMethod)}
              </label>
            </li>
          ))}
        </ul>
        : noPaymentMethodsErrorMessage
      }

    </fieldset>
  );
}

const NewPaymentMethodSelector = connect(mapStateToProps, mapDispatchToProps)(PaymentMethodSelector);

export { NewPaymentMethodSelector };
