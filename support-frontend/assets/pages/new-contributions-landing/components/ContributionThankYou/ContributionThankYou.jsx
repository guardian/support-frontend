// @flow

// ----- Imports ----- //

import { type Dispatch } from 'redux';
import React from 'react';
import { connect } from 'react-redux';
import { type ContributionType, getSpokenType } from 'helpers/contributions';
import MarketingConsent from '../MarketingConsentContainer';
import { type Action, setHasSeenDirectDebitThankYouCopy } from '../../contributionsLandingActions';
import type { PaymentMethod } from 'helpers/paymentMethods';
import { ContributionThankYouBlurb } from './ContributionThankYouBlurb';
import AnchorButton from 'components/button/anchorButton';
import SvgArrowLeft from 'components/svgs/arrowLeftStraight';
import { DirectDebit } from 'helpers/paymentMethods';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import ContributionSurvey from '../ContributionSurvey/ContributionsSurvey';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  contributionType: ContributionType,
  paymentMethod: PaymentMethod,
  hasSeenDirectDebitThankYouCopy: boolean,
  setHasSeenDirectDebitThankYouCopy: () => void,
  |};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
  paymentMethod: state.page.form.paymentMethod,
  hasSeenDirectDebitThankYouCopy: state.page.hasSeenDirectDebitThankYouCopy,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setHasSeenDirectDebitThankYouCopy: () => {
      dispatch(setHasSeenDirectDebitThankYouCopy());
    },
  };
}

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
          <section className="confirmation">
            <h3 className="confirmation__title">
              {`${directDebitHeaderSuffix}Look out for an email within three business days confirming your ${getSpokenType(props.contributionType)} recurring payment${directDebitMessageSuffix}`}
            </h3>
          </section>
        ) : null}
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
