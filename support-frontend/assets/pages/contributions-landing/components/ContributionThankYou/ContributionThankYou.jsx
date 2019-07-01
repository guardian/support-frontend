// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import React from 'react';
import { connect } from 'react-redux';
import { type ContributionType, getSpokenType } from 'helpers/contributions';
import MarketingConsent from '../MarketingConsentContainer';
import {
  type Action,
  setHasSeenDirectDebitThankYouCopy,
} from '../../contributionsLandingActions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { DirectDebit } from 'helpers/paymentMethods';
import { ContributionThankYouBlurb } from './ContributionThankYouBlurb';
import AnchorButton from 'components/button/anchorButton';
import SvgArrowLeft from 'components/svgs/arrowLeftStraight';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import ContributionSurvey from '../ContributionSurvey/ContributionsSurvey';
import { routes } from 'helpers/routes';
import {
  trackComponentClick,
  trackComponentLoad,
} from 'helpers/tracking/ophan';
import TrackableButton from 'components/button/trackableButton';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  hasSeenDirectDebitThankYouCopy: boolean,
  setHasSeenDirectDebitThankYouCopy: () => void,
  isSignedIn: boolean,
  email: string,
  csrf: string,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  hasSeenDirectDebitThankYouCopy: state.page.hasSeenDirectDebitThankYouCopy,
  isSignedIn: state.page.user.isSignedIn,
  email: state.page.form.formData.email,
  csrf: state.page.csrf.token,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setHasSeenDirectDebitThankYouCopy: () => {
      dispatch(setHasSeenDirectDebitThankYouCopy());
    },
  };
}


const createSignInLink = (email: string, csrf: string, contributionType: ContributionType) => {
  const payload = { email };
  fetch(routes.createSignInUrl, {
    method: 'post',
    headers: {
      'Csrf-Token': csrf,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Identity encryption service error');

    })
    .then((data) => {
      if (data && data.signInLink) {
        trackComponentClick(`sign-into-the-guardian-link-${contributionType}`);
        window.location.href = data.signInLink;
      } else {
        throw new Error('Encrypted sign in link missing from identity service response');
      }
    })
    .catch((error) => {
      console.error(error);
      trackComponentClick(`sign-into-the-guardian-link-error-${contributionType}`);
      window.location.href = 'https://profile.theguardian.com/signin';
    });
};

// ----- Render ----- //

function ContributionThankYou(props: PropTypes) {
  let directDebitHeaderSuffix = '';
  let directDebitMessageSuffix = '';

  if (props.paymentMethod === DirectDebit && !props.hasSeenDirectDebitThankYouCopy) {
    directDebitHeaderSuffix = 'Your Direct Debit has been set up. ';
    directDebitMessageSuffix = '. This will appear as \'Guardian Media Group\' on your bank statements';
    props.setHasSeenDirectDebitThankYouCopy();
  }

  return (
    <div className="thank-you__container">
      <div className="gu-content__form gu-content__form--thank-you">
        {props.contributionType !== 'ONE_OFF' ? (
          <section className="contribution-thank-you-block">
            <h3 className="contribution-thank-you-block__title">
              {`${directDebitHeaderSuffix}Look out for an email within three business days confirming your ${getSpokenType(props.contributionType)} recurring payment${directDebitMessageSuffix}`}
            </h3>
          </section>
        ) : null}
        {!props.isSignedIn ?
          <section className="contribution-thank-you-block">
            <h3 className="contribution-thank-you-block__title">
              Stay signed in to The Guardian
            </h3>
            <p className="contribution-thank-you-block__message">
              As a valued contributor, we want to ensure you are having the best experience on our site. To see
              far fewer requests for support, please sign in on each of the devices you use to access The
              Guardian – mobile, tablet, laptop or desktop. Please make sure you’ve verified your email address.
            </p>
            <TrackableButton
              aria-label="Sign into The Guardian"
              appearance="secondary"
              trackingEvent={
                () => {
                  trackComponentLoad(`sign-into-the-guardian-link-loaded-${props.contributionType}`);
                }
              }
              onClick={
                () => {
                  createSignInLink(props.email, props.csrf, props.contributionType);
                }}
            >
              Sign in now
            </TrackableButton>
          </section> : null }
        <MarketingConsent />
        <ContributionSurvey isRunning={false} contributionType={props.contributionType} />
        <SpreadTheWord />
        <div className="gu-content__return-link">
          <AnchorButton
            href="https://www.theguardian.com"
            appearance="greyHollow"
            aria-label="Return to The Guardian"
            icon={<SvgArrowLeft />}
            iconSide="left"
          >
            Return to The Guardian
          </AnchorButton>
        </div>
      </div>

      <ContributionThankYouBlurb />
    </div>
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYou);
