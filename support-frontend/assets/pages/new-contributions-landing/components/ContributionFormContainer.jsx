// @flow

// ----- Imports ----- //

import type { ContributionType } from 'helpers/contributions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import { isFrontlineCampaign, getQueryParameter } from 'helpers/url';
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

function campaignSpecificDetails() {
  if (isFrontlineCampaign()) {
    return {
      formMessage: (
        <div>
          <div className="form-message__headline">Make a contribution</div>
          <div className="form-message__body">to our dedicated series ‘The Frontline’</div>
        </div>
      ),
      headerCopy: 'The Frontline: Australia and the climate emergency',
      contributeCopy: (
        <div>
          <p>
            The north is flooded, the south parched by drought.
            The Murray Darling, our greatest river system, has dried to a trickle,
            crippling communities and turning up millions of dead fish.
            The ancient alpine forests of Tasmania have burned.
            The summer was the hottest on record.
            We are living the reality of climate change.
          </p>
          <p>
            <span>
              We’re asking readers to fund a new Guardian series – The Frontline: Australia and the climate emergency.
              With your support, we can cut through the rhetoric and focus the debate on the facts.
              That way everyone can learn about the devastating and immediate
              threats to our country and how best to find a solution.
            </span>&nbsp;
            {/* todo: find out why there's no space between these, unless I put &nbps; */}
            <span className="bold highlight">
              Please contribute to our new series on Australia’s climate emergency today.
            </span>
          </p>
        </div>
      ),
      tickerJsonUrl: '/ticker.json',
      // stuff for campaign that's not set here:
      // - CSS class (contributionsLanding.jsx)
      // - Terms & Conditions
      // - Just single contributions (via URL)
    };
  }

  return {};
}

function urlSpecificDetails() {
  if (getQueryParameter('ticker') === 'true') {
    return {
      tickerJsonUrl: '/ticker.json',
    };
  }

  return {};
}


// ----- Render ----- //

function ContributionFormContainer(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const countryGroupDetails = {
    ...countryGroupSpecificDetails[props.countryGroupId],
    ...campaignSpecificDetails(),
    ...urlSpecificDetails(),
  };

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
            <ContributionTicker
              tickerJsonUrl={countryGroupDetails.tickerJsonUrl}
              onGoalReached={props.setTickerGoalReached}
            /> : null
          }
          {countryGroupDetails.formMessage ?
            <div className="form-message">{countryGroupDetails.formMessage}</div> : null
          }
          {props.tickerGoalReached ?
            <div>
              Thank you to everyone who supported ‘The Frontline’.
              We’re no longer accepting contributions for the series, but you can still support
              The Guardian’s journalism with a single or recurring contribution
            </div>
            :
            <NewContributionForm
              onPaymentAuthorisation={onPaymentAuthorisation}
            />
          }
        </div>
        <DirectDebitPopUpForm
          onPaymentAuthorisation={onPaymentAuthorisation}
        />
      </div>
    );
}

const NewContributionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ContributionFormContainer);

export { NewContributionFormContainer };
