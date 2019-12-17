// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { getPaymentLabel, getValidPaymentMethods } from 'helpers/checkouts';
import { type Switches } from 'helpers/settings';
import {
  type ContributionType, contributionTypeIsRecurring,
} from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';
import SvgDirectDebitSymbol from 'components/svgs/directDebitSymbol';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';

import { type State } from '../contributionsLandingReducer';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit, PayPal } from 'helpers/paymentMethods';
import {
  type Action,
  updatePaymentMethod,
  updateSelectedExistingPaymentMethod,
} from '../contributionsLandingActions';
import { isUsableExistingPaymentMethod } from 'helpers/existingPaymentMethods/existingPaymentMethods';
import type {
  ExistingPaymentMethod,
  RecentlySignedInExistingPaymentMethod,
} from 'helpers/existingPaymentMethods/existingPaymentMethods';
import { getReauthenticateUrl } from 'helpers/externalLinks';
import AnimatedDots from 'components/spinners/animatedDots';
import { ExistingCard, ExistingDirectDebit, Stripe, AmazonPay } from '../../../helpers/paymentMethods';
import {
  getExistingPaymentMethodLabel,
  mapExistingPaymentMethodToPaymentMethod,
  subscriptionsToExplainerList,
  subscriptionToExplainerPart,
} from 'helpers/existingPaymentMethods/existingPaymentMethods';
import SecureTransactionIndicator from 'components/secureTransactionIndicator/secureTransactionIndicator';
import type {
  PaymentSecuritySecureTransactionGreyNonUKVariants,
} from 'helpers/abTests/abtestDefinitions';
import {
  type CountryGroupId,
  detect,
} from 'helpers/internationalisation/countryGroup';
import SvgAmazonPayLogo from 'components/svgs/amazonPayLogo';


// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  countryId: IsoCountry,
  contributionType: ContributionType,
  currency: IsoCurrency,
  existingPaymentMethods: ExistingPaymentMethod[] | typeof undefined,
  paymentMethod: PaymentMethod,
  existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
  updatePaymentMethod: PaymentMethod => (Function) => void,
  updateSelectedExistingPaymentMethod: (RecentlySignedInExistingPaymentMethod | typeof undefined) => Action,
  isTestUser: boolean,
  switches: Switches,
  paymentSecuritySecureTransactionGreyNonUKVariant: PaymentSecuritySecureTransactionGreyNonUKVariants,
  inAmazonPayTest: boolean,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  countryId: state.common.internationalisation.countryId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  existingPaymentMethods: state.common.existingPaymentMethods,
  paymentMethod: state.page.form.paymentMethod,
  existingPaymentMethod: state.page.form.existingPaymentMethod,
  isTestUser: state.page.user.isTestUser || false,
  switches: state.common.settings.switches,
  paymentSecuritySecureTransactionGreyNonUKVariant:
    state.common.abParticipations.paymentSecuritySecureTransactionGreyNonUK,
  inAmazonPayTest:
    state.common.abParticipations.amazonPaySingleUS === 'amazonPay',
});

const mapDispatchToProps = {
  updatePaymentMethod,
  updateSelectedExistingPaymentMethod,
};

// ----- Render ----- //

function getPaymentMethodLogo(paymentMethod: PaymentMethod) {
  switch (paymentMethod) {
    case PayPal:
      return <SvgPayPal />;
    case DirectDebit:
    case ExistingDirectDebit:
      return <SvgDirectDebitSymbol />;
    case AmazonPay:
      return <SvgAmazonPayLogo />;
    case Stripe:
    case ExistingCard:
    default:
      return <SvgNewCreditCard />;
  }
}

function withProps(props: PropTypes) {

  const paymentMethods: PaymentMethod[] =
    getValidPaymentMethods(props.contributionType, props.switches, props.countryId, props.inAmazonPayTest);

  const noPaymentMethodsErrorMessage =
    (<GeneralErrorMessage
      classModifiers={['no-valid-payments']}
      errorHeading="Payment methods are unavailable"
      errorReason="all_payment_methods_unavailable"
    />);

  // having to do this nasty cast because Flow sucks and type guards don't work through .filter
  const fullExistingPaymentMethods: RecentlySignedInExistingPaymentMethod[] =
    ((props.existingPaymentMethods || []).filter(isUsableExistingPaymentMethod): any);

  const countryGroupId: CountryGroupId = detect();

  const legendSimple = (
    <legend id="payment_method" className="form__legend"><h3>Payment method</h3></legend>
  );

  const legend = props.paymentSecuritySecureTransactionGreyNonUKVariant === 'V1_securetransactiongrey' && countryGroupId !== 'GBPCountries' ?
    (
      <div className="secure-transaction">
        {legendSimple} <SecureTransactionIndicator modifierClasses={['middle', 'showaftermobile']} />
      </div>
    ) :
    legendSimple;

  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['buttons', 'contribution-pay'])}>
      {legend}
      { paymentMethods.length ?
        <ul className="form__radio-group-list">
          {contributionTypeIsRecurring(props.contributionType) && !props.existingPaymentMethods && (
          <div className="awaiting-existing-payment-options">
            <AnimatedDots appearance="medium" />
          </div>
            )
          }
          {contributionTypeIsRecurring(props.contributionType) &&
          fullExistingPaymentMethods.map((existingPaymentMethod: RecentlySignedInExistingPaymentMethod) => (
            <li className="form__radio-group-item">
              <input
                id={`paymentMethodSelector-existing${existingPaymentMethod.billingAccountId}`}
                className="form__radio-group-input"
                name="paymentMethodSelector"
                type="radio"
                value={existingPaymentMethod}
                onChange={() => {
                    props.updatePaymentMethod(mapExistingPaymentMethodToPaymentMethod(existingPaymentMethod));
                    props.updateSelectedExistingPaymentMethod(existingPaymentMethod);
                  }}
                checked={
                    props.paymentMethod === mapExistingPaymentMethodToPaymentMethod(existingPaymentMethod) &&
                    props.existingPaymentMethod === existingPaymentMethod
                  }
                arial-labelledby="payment_method"
              />
              <label
                htmlFor={`paymentMethodSelector-existing${existingPaymentMethod.billingAccountId}`}
                className="form__radio-group-label has-existing-payment-option-explainer"
              >
                <span className="radio-ui" />
                <span className="radio-ui__label">{getExistingPaymentMethodLabel(existingPaymentMethod)}</span>
                {getPaymentMethodLogo(mapExistingPaymentMethodToPaymentMethod(existingPaymentMethod))}
              </label>
              <div className="existing-payment-option-explainer">
                  Used for your{' '}
                {subscriptionsToExplainerList(existingPaymentMethod.subscriptions.map(subscriptionToExplainerPart))}
              </div>
            </li>
            ))}
          {paymentMethods.map(paymentMethod => (
            <li className="form__radio-group-item">
              <input
                id={`paymentMethodSelector-${paymentMethod}`}
                className="form__radio-group-input"
                name="paymentMethodSelector"
                type="radio"
                value={paymentMethod}
                onChange={() => {
                  props.updatePaymentMethod(paymentMethod);
                  props.updateSelectedExistingPaymentMethod(undefined);
                }}
                checked={props.paymentMethod === paymentMethod}
              />
              <label htmlFor={`paymentMethodSelector-${paymentMethod}`} className="form__radio-group-label">
                <span className="radio-ui" />
                <span className="radio-ui__label">{getPaymentLabel(paymentMethod)}</span>
                {getPaymentMethodLogo(paymentMethod)}
              </label>
            </li>
          ))}
          {
            contributionTypeIsRecurring(props.contributionType) &&
            props.existingPaymentMethods &&
            props.existingPaymentMethods.length > 0 &&
            fullExistingPaymentMethods.length === 0 && (
              <li className="form__radio-group-item">
                ...or <a className="reauthenticate-link" href={getReauthenticateUrl()}>re-enter your password</a> to use one of your existing payment methods.
              </li>
            )
          }
        </ul>
        : noPaymentMethodsErrorMessage
      }

    </fieldset>
  );
}

function withoutProps() {
  return (
    <fieldset className={classNameWithModifiers('form__radio-group', ['buttons', 'contribution-pay'])}>
      <legend className="form__legend">Payment method</legend>
      <ul className="form__radio-group-list">
        {[Stripe, PayPal, DirectDebit].map(paymentMethod => (
          <li className="form__radio-group-item">
            <input
              id={`paymentMethodSelector-${paymentMethod}`}
              className="form__radio-group-input"
              name="paymentMethodSelector"
              type="radio"
              value={paymentMethod}
            />
            <label htmlFor={`paymentMethodSelector-${paymentMethod}`} className="form__radio-group-label">
              <span className="radio-ui" />
              <span className="radio-ui__label">{getPaymentLabel(paymentMethod)}</span>
              {getPaymentMethodLogo(paymentMethod)}
            </label>
          </li>
          ))}
      </ul>
    </fieldset>
  );
}

export const PaymentMethodSelector = connect(mapStateToProps, mapDispatchToProps)(withProps);
export const EmptyPaymentMethodSelector = withoutProps;
