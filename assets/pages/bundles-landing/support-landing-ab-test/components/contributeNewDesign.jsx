// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import InfoSection from 'components/infoSection/infoSection';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import Secure from 'components/secure/secure';
import CtaLink from 'components/ctaLink/ctaLink';
import PayPalContributionButton
  from 'components/paymentButtons/payPalContributionButton/payPalContributionButton';
import TermsPrivacy from 'components/legal/termsPrivacy/termsPrivacy';
import { contribCamelCase } from 'helpers/contributions';

import type {
  Amount,
  Contrib as ContributionType,
  ContribError as ContributionError,
} from 'helpers/contributions';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abTests/abtest';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

import ContributionSelection from './contributionSelectionNewDesign';
import GraveError from './graveErrorNewDesign';
import {
  changeContribType,
  changeContribAmountAnnual,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
  changeContribAmount,
  setPayPalError,
} from '../../bundlesLandingActions';
import {
  getCardLink,
  getCardCtaText,
  getCardA11yText,
} from '../helpers/contributionLinks';


// ----- Props ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contributionType: ContributionType,
  country: IsoCountry,
  currency: Currency,
  selectedAmount: Amount,
  contributionError: ContributionError,
  abTests: Participations,
  referrerAcquisitionData: ReferrerAcquisitionData,
  payPalError: string,
  changeContributionType: string => void,
  changeContributionAmountAnnual: string => void,
  changeContributionAmountMonthly: string => void,
  changeContributionAmountOneOff: string => void,
  setContributionCustomAmount: string => void,
  setPayPalError: string => void,
};

/* eslint-enable react/no-unused-prop-types */

function mapStateToProps(state) {

  const contributionTypeCamelCase = contribCamelCase(state.page.type);

  return {
    contributionType: state.page.type,
    country: state.common.country,
    currency: state.common.currency,
    selectedAmount: state.page.amount[contributionTypeCamelCase],
    contributionError: state.page.error,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abTests: state.common.abParticipations,
    payPalError: state.page.payPalError,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    changeContributionType: (contributionType: ContributionType) => {
      dispatch(changeContribType(contributionType));
    },
    changeContributionAmountAnnual: (value: string) => {
      dispatch(changeContribAmountAnnual({ value, userDefined: false }));
    },
    changeContributionAmountMonthly: (value: string) => {
      dispatch(changeContribAmountMonthly({ value, userDefined: false }));
    },
    changeContributionAmountOneOff: (value: string) => {
      dispatch(changeContribAmountOneOff({ value, userDefined: false }));
    },
    setContributionCustomAmount: (value: string) => {
      dispatch(changeContribAmount({ value, userDefined: true }));
    },
    setPayPalError: (error: string) => {
      dispatch(setPayPalError(error));
    },
  };

}


// ----- Functions ----- //

function getAmountToggle(props: PropTypes) {

  switch (props.contributionType) {
    case 'ANNUAL': return props.changeContributionAmountAnnual;
    case 'MONTHLY': return props.changeContributionAmountMonthly;
    default: return props.changeContributionAmountOneOff;
  }

}

function ctaClick(props: PropTypes) {

  const linkLocation = getCardLink(
    props.contributionType,
    props.selectedAmount,
    props.currency,
  );

  return () => {
    if (!props.contributionError) {
      window.location = linkLocation;
    }
  };

}

function cardButton(props: PropTypes, includeQaId: boolean = true) {

  return (
    <CtaLink
      ctaId="contribute"
      text={getCardCtaText(props.contributionType)}
      onClick={ctaClick(props)}
      id={includeQaId ? 'qa-contribute-button' : null}
      accessibilityHint={getCardA11yText(props.contributionType)}
    />
  );

}

function payPalButton(props: PropTypes) {

  if (props.contributionType === 'ONE_OFF') {

    return (<PayPalContributionButton
      amount={Number(props.selectedAmount.value)}
      abParticipations={props.abTests}
      referrerAcquisitionData={props.referrerAcquisitionData}
      isoCountry={props.country}
      errorHandler={props.setPayPalError}
      canClick={!props.contributionError}
      buttonText="Contribute with PayPal"
    />);

  }

  return null;

}

function payPalErrorMessage(props: PropTypes) {

  if (props.payPalError) {
    return (
      <GraveError
        ctaLink={cardButton(props, false)}
        onClose={() => props.setPayPalError('')}
      />
    );
  }

  return null;

}

function termsAndConditions(
  contributionType: ContributionType,
  country: IsoCountry,
) {

  if (contributionType === 'ONE_OFF') {

    return (
      <TermsPrivacy country={country} />
    );

  }

  return null;

}


// ----- Component ----- //

function Contribute(props: PropTypes) {

  return (
    <div className="contribute-new-design" id="contribute">
      <InfoSection
        heading="contribute"
        className="contribute-new-design__content gu-content-margin"
        headingContent={<div><Secure /><InlinePaymentLogos /></div>}
      >
        <Secure />
        <p className="contribute-new-design__description">
          Support the Guardian&#39;s editorial operations by making a monthly,
          or one-off contribution today
        </p>
        <ContributionSelection
          contributionType={props.contributionType}
          country={props.country}
          currency={props.currency}
          selectedAmount={props.selectedAmount}
          toggleAmount={getAmountToggle(props)}
          toggleType={props.changeContributionType}
          setCustomAmount={props.setContributionCustomAmount}
          contributionError={props.contributionError}
        />
        {cardButton(props)}
        {payPalButton(props)}
        {termsAndConditions(props.contributionType, props.country)}
        {payPalErrorMessage(props)}
      </InfoSection>
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Contribute);
