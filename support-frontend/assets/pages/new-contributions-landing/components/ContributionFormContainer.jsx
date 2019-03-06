// @flow

// ----- Imports ----- //

import type { ContributionType, PaymentMethod } from 'helpers/contributions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type ErrorReason } from 'helpers/errorReasons';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import { setPayPalHasLoaded } from 'helpers/paymentIntegrations/payPalActions';

import { type State } from '../contributionsLandingReducer';
import { NewContributionForm } from './ContributionForm';
import { ContributionTicker } from './ContributionTicker/ContributionTicker';

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
  paymentError: ErrorReason | null,
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
  contributionType: ContributionType,
  referrerAcquisitionData: ReferrerAcquisitionData,
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
  referrerAcquisitionData: state.common.referrerAcquisitionData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
  payPalSetHasLoaded: () => { dispatch(setPayPalHasLoaded()); },
});

// ----- Functions ----- //

export type CountryMetaData = {
  headerCopy: string,
  contributeCopy?: React$Element<string>,
  // URL to fetch ticker data from. null/undefined implies no ticker
  tickerJsonUrl?: string,
  // Optional message to display at the top of the form
  formMessage?: React$Element<string>,
};

const defaultHeaderCopy = 'Help\xa0us\xa0deliver\nthe\xa0independent\njournalism\xa0the\nworld\xa0needs';
const defaultContributeCopy = (
  <span>
    The Guardian is editorially independent, meaning we set our own agenda. Our journalism is free from commercial
    bias and not influenced by billionaire owners, politicians or shareholders. No one edits our editor. No one
    steers our opinion. This is important as it enables us to give a voice to those less heard, challenge the
    powerful and hold them to account. It’s what makes us different to so many others in the media, at a time when
    factual, honest reporting is crucial.
    <span className="bold"> Your support is critical for the future of Guardian journalism.</span>
  </span>);

const defaultHeaderCopyAndContributeCopy: CountryMetaData = {
  headerCopy: defaultHeaderCopy,
  contributeCopy: defaultContributeCopy,
};

const australiaHeadline = 'Help\xa0us\xa0deliver\nthe\xa0independent\njournalism\nAustralia\xa0needs';

const australiaClimateCampaignFormMessage = (
  <div className="climate-crunch">
    <div className="climate-crunch__headline">Make a contribution</div>
    <div className="climate-crunch__body">to our dedicated series ‘Climate Crunch’</div>
  </div>
);

const countryGroupSpecificDetails: {
  [CountryGroupId]: CountryMetaData
} = {
  GBPCountries: defaultHeaderCopyAndContributeCopy,
  EURCountries: defaultHeaderCopyAndContributeCopy,
  UnitedStates: defaultHeaderCopyAndContributeCopy,
  AUDCountries: {
    ...defaultHeaderCopyAndContributeCopy,
    headerCopy: australiaHeadline,
    tickerJsonUrl: '/ticker.json',
    formMessage: australiaClimateCampaignFormMessage,
  },
  International: defaultHeaderCopyAndContributeCopy,
  NZDCountries: defaultHeaderCopyAndContributeCopy,
  Canada: defaultHeaderCopyAndContributeCopy,
};

// ----- Render ----- //

function ContributionFormContainer(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const countryGroupDetails = countryGroupSpecificDetails[props.countryGroupId];

  return props.paymentComplete ?
    <Redirect to={props.thankYouRoute} />
    : (
      <div className="gu-content__content gu-content__content-contributions gu-content__content--flex">
        <div className="gu-content__blurb">
          <h1 className="gu-content__blurb-header">{countryGroupDetails.headerCopy}</h1>
          { countryGroupDetails.contributeCopy ?
            <p className="gu-content__blurb-blurb">{countryGroupDetails.contributeCopy}</p> : null
          }
        </div>

        <div className="gu-content__form">
          {countryGroupDetails.tickerJsonUrl ?
            <ContributionTicker tickerJsonUrl={countryGroupDetails.tickerJsonUrl} /> : null
          }
          {countryGroupDetails.formMessage ?
            <div className="gu-content__form__message">{countryGroupDetails.formMessage}</div> : null
          }
          <NewContributionForm
            onPaymentAuthorisation={onPaymentAuthorisation}
          />
        </div>
        <DirectDebitPopUpForm
          onPaymentAuthorisation={onPaymentAuthorisation}
        />
      </div>
    );
}

const NewContributionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ContributionFormContainer);

export { NewContributionFormContainer };
