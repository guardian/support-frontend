// @flow

// ----- Imports ----- //

import type { Contrib, PaymentMethod } from 'helpers/contributions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';

import { type State } from '../contributionsLandingReducer';
import { NewContributionForm } from './ContributionForm';
import { setPayPalHasLoaded } from '../contributionsLandingActions';

import {
  paymentWaiting,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
} from '../contributionsLandingActions';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  csrf: Csrf,
  payPalHasLoaded: boolean,
  paymentComplete: boolean,
  payPalSwitchStatus: Status,
  paymentError: CheckoutFailureReason | null,
  currencyId: IsoCurrency,
  countryGroupId: CountryGroupId,
  thankYouRoute: string,
  setPaymentIsWaiting: boolean => void,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  openDirectDebitPopUp: () => void,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  payPalSetHasLoaded: () => void,
  isTestUser: boolean,
  paymentMethod: PaymentMethod,
  contributionType: Contrib,
|};

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  csrf: state.page.csrf,
  payPalHasLoaded: state.page.form.payPalHasLoaded,
  paymentComplete: state.page.form.paymentComplete,
  payPalSwitchStatus: state.common.settings.switches.recurringPaymentMethods.payPal,
  paymentError: state.page.form.paymentError,
  currencyId: state.common.internationalisation.currencyId,
  countryGroupId: state.common.internationalisation.countryGroupId,
  isTestUser: state.page.user.isTestUser,
  paymentMethod: state.page.form.paymentMethod,
  contributionType: state.page.form.contributionType,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
  payPalSetHasLoaded: () => { dispatch(setPayPalHasLoaded()); },
});

// ----- Render ----- //

function ContributionFormContainer(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  return props.paymentComplete ?
    <Redirect to={props.thankYouRoute} />
    : (
      <div className="gu-content__content">
        <h1 className="header">{countryGroupSpecificDetails[props.countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[props.countryGroupId].contributeCopy}</p>
        <NewContributionForm
          onPaymentAuthorisation={onPaymentAuthorisation}
        />
        <DirectDebitPopUpForm
          onPaymentAuthorisation={onPaymentAuthorisation}
        />
      </div>
    );
}

const NewContributionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ContributionFormContainer);

export { NewContributionFormContainer };
