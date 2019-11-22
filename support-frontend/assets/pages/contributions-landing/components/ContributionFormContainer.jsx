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
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { LandingPageCopyReturningSinglesTestVariants, NewLandingPageTemplateTestVariants } from 'helpers/abTests/abtestDefinitions';
import SecureTransactionIndicator from '../../../../assets/components/secureTransactionIndicator/secureTransactionIndicator';


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
  isReturningContributor: boolean,
  countryId: IsoCountry,
  landingPageCopyReturningSinglesTestVariant: LandingPageCopyReturningSinglesTestVariants,
  newTemplateVariant: NewLandingPageTemplateTestVariants,
|};

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  paymentComplete: state.page.form.paymentComplete,
  countryGroupId: state.common.internationalisation.countryGroupId,
  tickerGoalReached: state.page.form.tickerGoalReached,
  isReturningContributor: state.page.user.isReturningContributor,
  countryId: state.common.internationalisation.countryId,
  landingPageCopyReturningSinglesTestVariant: state.common.abParticipations.landingPageCopyReturningSingles,
  newTemplateVariant: state.common.abParticipations.newLandingPageTemplateTest,
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
  // Optional message to display at the top of the form
  formMessage?: React$Element<string>,
};

const defaultHeaderCopy = 'Support\xa0our\njournalism\xa0with\na\xa0contribution\nof\xa0any\xa0size';
const defaultContributeCopy = (
  <span>
    Readers from around the world, like you, make The Guardian’s work possible. We need your support to
    deliver quality, investigative journalism – and to keep it open for everyone. At a time when factual,
    honest reporting is critical, your support is essential in protecting our editorial independence.
    <span className="gu-content__blurb-blurb-last-sentence"> Every contribution, however big or small, is so valuable for our future.</span>
  </span>);

const usEoyHeaderCopy = 'Offset\xa0fake\nnews\xa0this\nGiving\xa0Tuesday';
const usEoyAppealContributeCopy = (
  <span>
    Help the truth triumph in 2020. Amid a tsunami of disinformation and “alternative facts,” the
    need for truth has never been greater. Thanks to your valuable contributions, tens of millions
    across America read our quality, factual journalism at this critical time. Help us reach our year-end goal.
  </span>);

const defaultHeaderCopyAndContributeCopy: CountryMetaData = {
  headerCopy: defaultHeaderCopy,
  contributeCopy: defaultContributeCopy,
};

const usEoyAppealCopyAndContributeCopy: CountryMetaData = {
  headerCopy: usEoyHeaderCopy,
  contributeCopy: usEoyAppealContributeCopy,
};

const campaignName = getCampaignName();
const campaign = campaignName && campaigns[campaignName] ? campaigns[campaignName] : null;

// ----- Render ----- //

function withProps(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const landingPageCopy = (): CountryMetaData => {
    if (props.countryId === 'US') {
      return usEoyAppealCopyAndContributeCopy;
    }

    return defaultHeaderCopyAndContributeCopy;
  };

  const countryGroupDetails = {
    ...landingPageCopy(),
    ...campaign || {},
  };


  const showSecureTransactionIndicator = props.countryGroupId === 'GBPCountries'
    && props.newTemplateVariant === 'new_template' ?
      <SecureTransactionIndicator modifierClasses={['new-template']} /> : null;

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
        {showSecureTransactionIndicator}

        {campaign && campaign.tickerSettings && campaign.tickerSettings.tickerJsonUrl ?
          <ContributionTicker
            tickerJsonUrl={campaign.tickerSettings.tickerJsonUrl}
            onGoalReached={props.setTickerGoalReached}
            tickerType={campaign.tickerSettings.tickerType}
            currencySymbol={campaign.tickerSettings.localCurrencySymbol}
          /> : null
        }
        {props.tickerGoalReached && campaign && campaign.tickerSettings && campaign.tickerSettings.goalReachedCopy ?
          campaign.tickerSettings.goalReachedCopy :
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
      {campaign && campaign.extraComponent}
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
