// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { type CountryGroupId, countryGroups } from 'helpers/internationalisation/countryGroup';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/readerRevenueApis';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import ContributionTicker from 'components/ticker/contributionTicker';
import { campaigns, getCampaignName } from 'helpers/campaigns';
import { type State } from '../contributionsLandingReducer';
import { ContributionForm, EmptyContributionForm } from './ContributionForm';
import { onThirdPartyPaymentAuthorised, paymentWaiting, setTickerGoalReached } from '../contributionsLandingActions';
import type { LandingPageCopyAllContributionsTestVariants } from 'helpers/abTests/abtestDefinitions';

// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  paymentComplete: boolean,
  countryGroupId: CountryGroupId,
  thankYouRoute: string,
  setPaymentIsWaiting: boolean => void,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  setTickerGoalReached: () => void,
  tickerGoalReached: boolean,
  campaignCodeParameter: ?string,
  landingPageCopyAllContributionsTestVariant: LandingPageCopyAllContributionsTestVariants,
|};

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  paymentComplete: state.page.form.paymentComplete,
  countryGroupId: state.common.internationalisation.countryGroupId,
  tickerGoalReached: state.page.form.tickerGoalReached,
  landingPageCopyAllContributionsTestVariant: state.common.abParticipations.landingPageCopyAllContributions,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  setTickerGoalReached: () => { dispatch(setTickerGoalReached()); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
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

// JTL: This const (variantContributeCopy) is part of a hardcoded test for landing page copy:
// To be removed on completion of the test. The default copy (above) should be replaced by this
// copy object if the variant (below copy) is successful.
const variantContributeCopy = (
  <span>
    Readers from around the world, like you, make The&nbsp;Guardian’s work possible. We need your support to deliver
    quality, investigative journalism – and to keep it open for everyone. At a time when factual, honest reporting
    is critical, your support is essential in protecting our editorial independence.
    <span className="gu-content__blurb-blurb-last-sentence"> Every reader contribution, however big or small, is so valuable.</span>
  </span>);

const defaultHeaderCopyAndContributeCopy: CountryMetaData = {
  headerCopy: defaultHeaderCopy,
  contributeCopy: defaultContributeCopy,
};

// JTL: This const (variantHeaderCopyAndContributeCopy) is part of a hardcoded test for landing page copy.
// To be removed on completion of the test:
const variantHeaderCopyAndContributeCopy: CountryMetaData = {
  headerCopy: defaultHeaderCopy,
  contributeCopy: variantContributeCopy,
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

// JTL: This const (countryGroupSpecificDetailsForVariant) is part of a hardcoded test for landing page copy.
// To be removed on completion of the test:
const variantCountryGroupSpecificDetails: {
  [CountryGroupId]: CountryMetaData
} = {
  GBPCountries: variantHeaderCopyAndContributeCopy,
  EURCountries: variantHeaderCopyAndContributeCopy,
  UnitedStates: variantHeaderCopyAndContributeCopy,
  AUDCountries: {
    ...variantHeaderCopyAndContributeCopy,
    headerCopy: 'Help\xa0us\xa0deliver\nthe\xa0independent\njournalism\nAustralia\xa0needs',
  },
  International: variantHeaderCopyAndContributeCopy,
  NZDCountries: variantHeaderCopyAndContributeCopy,
  Canada: variantHeaderCopyAndContributeCopy,
};

const campaignName = getCampaignName();
const campaign = campaignName && campaigns[campaignName] ? campaigns[campaignName] : null;

// ----- Render ----- //

function withProps(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  // JTL: This const (countryGroupSpecificDetailsForVariant) is part of a hardcoded test for landing page copy.
  // To be removed and refactored into countryGroupDetails object on completion of the test:
  const landingPageCopy = props.landingPageCopyAllContributionsTestVariant === 'allContributions' ? variantCountryGroupSpecificDetails[props.countryGroupId] : countryGroupSpecificDetails[props.countryGroupId];

  const countryGroupDetails = {
    ...landingPageCopy,
    ...campaign || {},
  };

  if (props.paymentComplete) {
    // We deliberately allow the redirect to REPLACE rather than PUSH /thankyou onto the history stack.
    // This is because going 'back' to the /contribute page is not helpful, and the client-side routing would redirect
    // back to /thankyou given the current state of the redux store.
    // The effect is that clicking back in the browser will take the user to the page before they arrived at /contribute
    return (<Redirect to={props.thankYouRoute} push={false} />);
  }

  if (props.campaignCodeParameter && !campaign) {
    // A campaign code was supplied in the url path, but it's not a valid campaign
    return (
      <Redirect
        to={`/${countryGroups[props.countryGroupId].supportInternationalisationId}/contribute`}
        push={false}
      />
    );
  }

  return (
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
          <ContributionForm
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

function withoutProps() {
  return (
    <div className="gu-content__content gu-content__content-contributions gu-content__content--flex">
      <div className="gu-content__blurb">
        <div className="gu-content__blurb-header-container">
          <h1 className="gu-content__blurb-header">{defaultHeaderCopy}</h1>
        </div>
      </div>

      <div className="gu-content__form">
        <EmptyContributionForm />
      </div>
    </div>
  );
}

export const ContributionFormContainer = connect(mapStateToProps, mapDispatchToProps)(withProps);
export const EmptyContributionFormContainer = withoutProps;
