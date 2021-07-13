// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';

import { connect } from 'react-redux';

import { getPaymentLabel, getValidPaymentMethods } from 'helpers/forms/checkouts';
import { type Switches } from 'helpers/globalsAndSwitches/settings';
import {
  type ContributionType, contributionTypeIsRecurring,
} from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import SvgNewCreditCard from 'components/svgs/newCreditCard';
import SvgPayPal from 'components/svgs/paypal';
import SvgDirectDebitSymbol from 'components/svgs/directDebitSymbol';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';

import { type State } from '../contributionsLandingReducer';
import { DirectDebit, PayPal, type PaymentMethod } from 'helpers/forms/paymentMethods';
import {
  type Action,
  updatePaymentMethod,
  updateSelectedExistingPaymentMethod,
  loadPayPalExpressSdk, loadAmazonPaySdk,
} from '../contributionsLandingActions';
import { isUsableExistingPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type {
  ExistingPaymentMethod,
  RecentlySignedInExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { getReauthenticateUrl } from 'helpers/urls/externalLinks';
import AnimatedDots from 'components/spinners/animatedDots';
import { ExistingCard, ExistingDirectDebit, Stripe, AmazonPay } from '../../../helpers/forms/paymentMethods';
import {
  getExistingPaymentMethodLabel,
  mapExistingPaymentMethodToPaymentMethod,
  subscriptionsToExplainerList,
  subscriptionToExplainerPart,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import SecureTransactionIndicator from 'components/secureTransactionIndicator/secureTransactionIndicator';
import SvgAmazonPayLogo from 'components/svgs/amazonPayLogo';
import { RadioGroup, Radio } from '@guardian/src-radio';

import SvgPayPalDs from 'components/svgs/paypalDs';
import SvgDirectDebitSymbolDs from 'components/svgs/directDebitSymbolDs';
import SvgAmazonPayLogoDs from 'components/svgs/amazonPayLogoDs';
import SvgNewCreditCardDs from 'components/svgs/newCreditCardDs';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import ContributionChoicesHeader from './ContributionChoicesHeader';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  countryId: IsoCountry,
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
  currency: IsoCurrency,
  existingPaymentMethods: ExistingPaymentMethod[] | typeof undefined,
  paymentMethod: PaymentMethod,
  existingPaymentMethod: RecentlySignedInExistingPaymentMethod,
  updatePaymentMethod: PaymentMethod => (Function) => void,
  updateSelectedExistingPaymentMethod: (RecentlySignedInExistingPaymentMethod | typeof undefined) => Action,
  isTestUser: boolean,
  switches: Switches,
  payPalHasBegunLoading: boolean,
  amazonPayHasBegunLoading: boolean,
  loadPayPalExpressSdk: (contributionType: ContributionType) => (dispatch: Function) => void,
  loadAmazonPaySdk: (countryGroupId: CountryGroupId, isTestUser: boolean) => (dispatch: Function) => void,
  checkoutFormHasBeenSubmitted: boolean,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  countryId: state.common.internationalisation.countryId,
  countryGroupId: state.common.internationalisation.countryGroupId,
  currency: state.common.internationalisation.currencyId,
  contributionType: state.page.form.contributionType,
  existingPaymentMethods: state.common.existingPaymentMethods,
  paymentMethod: state.page.form.paymentMethod,
  existingPaymentMethod: state.page.form.existingPaymentMethod,
  isTestUser: state.page.user.isTestUser || false,
  switches: state.common.settings.switches,
  payPalHasBegunLoading: state.page.form.payPalData.hasBegunLoading,
  amazonPayHasBegunLoading: state.page.form.amazonPayData.hasBegunLoading,
  checkoutFormHasBeenSubmitted: state.page.form.formData.checkoutFormHasBeenSubmitted,
});

const mapDispatchToProps = {
  updatePaymentMethod,
  updateSelectedExistingPaymentMethod,
  loadPayPalExpressSdk,
  loadAmazonPaySdk,
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

const getPaymentMethodLogoDs = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case PayPal:
      return <SvgPayPalDs />;
    case DirectDebit:
    case ExistingDirectDebit:
      return <SvgDirectDebitSymbolDs />;
    case AmazonPay:
      return <SvgAmazonPayLogoDs />;
    case Stripe:
    case ExistingCard:
    default:
      return <SvgNewCreditCardDs />;
  }
};


const legend = (
  <div className="secure-transaction">
    <legend id="payment_method"><ContributionChoicesHeader>Payment Method</ContributionChoicesHeader></legend>
    <SecureTransactionIndicator modifierClasses={['middle']} />
  </div>
);

const renderLabelAndLogo = (paymentMethod: PaymentMethod) => (
  <>
    <div>{getPaymentLabel(paymentMethod)}</div>
    {getPaymentMethodLogoDs(paymentMethod)}
  </>
);

const renderExistingLabelAndLogo = (existingPaymentMethod: RecentlySignedInExistingPaymentMethod) => (
  <>
    <div>{getExistingPaymentMethodLabel(existingPaymentMethod)}</div>
    {getPaymentMethodLogoDs(mapExistingPaymentMethodToPaymentMethod(existingPaymentMethod))}
  </>
);

// having to do this nasty cast because Flow sucks and type guards don't work through .filter
const getFullExistingPaymentMethods = (props: PropTypes): RecentlySignedInExistingPaymentMethod[] =>
  ((props.existingPaymentMethods || []).filter(isUsableExistingPaymentMethod): any);

const noPaymentMethodsErrorMessage =
  (<GeneralErrorMessage
    classModifiers={['no-valid-payments']}
    errorHeading="Payment methods are unavailable"
    errorReason="all_payment_methods_unavailable"
  />);

const radioCss = {
  '& + span': {
    display: 'flex',
    width: '100%',
    margin: 0,
    justifyContent: 'space-between',
  },
  '& + span svg': {
    width: '36px',
    height: '24px',
  },
  '&:not(:checked) + span svg': {
    filter: 'grayscale(100%)',
  },
};

const onPaymentMethodUpdate = (paymentMethod: PaymentMethod, props: PropTypes) => {
  switch (paymentMethod) {
    case PayPal:
      if (!props.payPalHasBegunLoading) {
        props.loadPayPalExpressSdk(props.contributionType);
      }
      break;
    case AmazonPay:
      if (!props.amazonPayHasBegunLoading) {
        props.loadAmazonPaySdk(props.countryGroupId, props.isTestUser);
      }
      break;
    default:
  }

  props.updatePaymentMethod(paymentMethod);
  props.updateSelectedExistingPaymentMethod(undefined);
};


function withProps(props: PropTypes) {
  const paymentMethods: PaymentMethod[] =
    getValidPaymentMethods(props.contributionType, props.switches, props.countryId, props.countryGroupId);

  const fullExistingPaymentMethods = getFullExistingPaymentMethods(props);

  const showErrorMessage = props.checkoutFormHasBeenSubmitted && props.paymentMethod === 'None';

  return (
    <div
      className={classNameWithModifiers('form__radio-group', ['buttons', 'contribution-pay'])}
    >
      {legend}
      { paymentMethods.length ?
        <RadioGroup className="form__radio-group-list" error={showErrorMessage && 'Please select a payment method'}>
          {contributionTypeIsRecurring(props.contributionType) && !props.existingPaymentMethods && (
            <div className="awaiting-existing-payment-options">
              <AnimatedDots appearance="medium" />
            </div>
          )
          }
          {contributionTypeIsRecurring(props.contributionType) &&
          fullExistingPaymentMethods.map((existingPaymentMethod: RecentlySignedInExistingPaymentMethod) => (
            <>
              <Radio
                id={`paymentMethodSelector-existing${existingPaymentMethod.billingAccountId}`}
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
                label={renderExistingLabelAndLogo(existingPaymentMethod)}
                cssOverrides={radioCss}
              />
              <div css={css`
                  font-size: small;
                  font-style: italic;
                  margin-left: 40px;
                  padding-bottom: 6px;
                  color: #767676;
                  padding-right: 40px;
                `}
              >
                Used for your{' '}
                {subscriptionsToExplainerList(existingPaymentMethod.subscriptions.map(subscriptionToExplainerPart))}
              </div>
            </>
          ))}
          {paymentMethods.map(paymentMethod => (
            <Radio
              id={`paymentMethodSelector-${paymentMethod}`}
              name="paymentMethodSelector"
              type="radio"
              value={paymentMethod}
              onChange={() => {
                  onPaymentMethodUpdate(paymentMethod, props);
                }}
              checked={props.paymentMethod === paymentMethod}
              label={renderLabelAndLogo(paymentMethod)}
              cssOverrides={radioCss}
            />
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
        </RadioGroup>
        : noPaymentMethodsErrorMessage
      }
    </div>);
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
