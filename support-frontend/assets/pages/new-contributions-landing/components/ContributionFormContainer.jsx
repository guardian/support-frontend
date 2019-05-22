// @flow

// ----- Imports ----- //

import type { ContributionType } from 'helpers/contributions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type ErrorReason } from 'helpers/errorReasons';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';
import ContributionTicker from 'components/ticker/contributionTicker';
import { setPayPalHasLoaded } from 'helpers/paymentIntegrations/payPalActions';
import { campaigns, getCampaignName } from 'helpers/campaigns';
import { type State } from '../contributionsLandingReducer';
import { NewContributionForm } from './ContributionForm';

import {
  paymentWaiting,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
  setTickerGoalReached,
} from '../contributionsLandingActions';
import type { PaymentMethod } from 'helpers/paymentMethods';

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
  setTickerGoalReached: () => void,
  openDirectDebitPopUp: () => void,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  payPalSetHasLoaded: () => void,
  isTestUser: boolean,
  paymentMethod: PaymentMethod,
  contributionType: ContributionType,
  referrerAcquisitionData: ReferrerAcquisitionData,
  tickerGoalReached: boolean,
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
  tickerGoalReached: state.page.form.tickerGoalReached,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  setTickerGoalReached: () => { dispatch(setTickerGoalReached()); },
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
    <span className="gu-content__blurb-blurb-last-sentence"> Your support is critical for the future of Guardian journalism.</span>
  </span>);

const defaultHeaderCopyAndContributeCopy: CountryMetaData = {
  headerCopy: defaultHeaderCopy,
  contributeCopy: defaultContributeCopy,
};

const countryGroupSpecificDetails: {
  [CountryGroupId]: CountryMetaData
} = {
  GBPCountries: defaultHeaderCopyAndContributeCopy,
  EURCountries: defaultHeaderCopyAndContributeCopy,
  UnitedStates: defaultHeaderCopyAndContributeCopy,
  AUDCountries: {
    ...defaultHeaderCopyAndContributeCopy,
    headerCopy: 'Help\xa0us\xa0deliver\nthe\xa0independent\njournalism\nAustralia\xa0needs',
  },
  International: defaultHeaderCopyAndContributeCopy,
  NZDCountries: defaultHeaderCopyAndContributeCopy,
  Canada: defaultHeaderCopyAndContributeCopy,
};

const campaignName = getCampaignName();
const campaign = campaignName && campaigns[campaignName] ? campaigns[campaignName] : null;

// ----- Render ----- //

function ContributionFormContainer(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const countryGroupDetails = {
    ...countryGroupSpecificDetails[props.countryGroupId],
    ...campaign || {},
  };

  return props.paymentComplete ?
    // We deliberately allow the redirect to REPLACE rather than PUSH /thankyou onto the history stack.
    // This is because going 'back' to the /contribute page is not helpful, and the client-side routing would redirect
    // back to /thankyou given the current state of the redux store.
    // The effect is that clicking back in the browser will take the user to the page before they arrived at /contribute
    <Redirect to={props.thankYouRoute} push={false} />
    : (
      <div className="gu-content__content gu-content__content-contributions gu-content__content--flex">
        <div className="gu-content__blurb">
          <div className="gu-content__blurb-header-container">
            <h1 className="gu-content__blurb-header">{countryGroupDetails.headerCopy}</h1>
          </div>
          { countryGroupDetails.contributeCopy ?
            <p className="gu-content__blurb-blurb">{countryGroupDetails.contributeCopy}</p> : null
          }
        </div>

        <div className="gu-content__form">
          {campaign && campaign.tickerJsonUrl ?
            <ContributionTicker
              tickerJsonUrl={campaign.tickerJsonUrl}
              onGoalReached={props.setTickerGoalReached}
              tickerType={campaign.tickerType}
              currencySymbol={campaign.localCurrencySymbol}
            /> : null
          }
          {props.tickerGoalReached && campaign && campaign.goalReachedCopy ? campaign.goalReachedCopy :
          <div>
            {countryGroupDetails.formMessage ?
              <div className="form-message">{countryGroupDetails.formMessage}</div> : null
              }
            <NewContributionForm
              onPaymentAuthorisation={onPaymentAuthorisation}
            />
          </div>
          }
        </div>
        <DirectDebitPopUpForm
          buttonText="Contribute with Direct Debit"
          onPaymentAuthorisation={onPaymentAuthorisation}
        />
      </div>
    );
}

const NewContributionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ContributionFormContainer);

export { NewContributionFormContainer };
