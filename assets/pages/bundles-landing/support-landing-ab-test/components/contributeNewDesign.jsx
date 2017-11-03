// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import InfoSection from 'components/infoSection/infoSection';
import InlinePaymentLogos from 'components/inlinePaymentLogos/inlinePaymentLogos';
import Secure from 'components/secure/secure';
import CtaLink from 'components/ctaLink/ctaLink';
import { contribCamelCase } from 'helpers/contributions';

import type {
  Amount,
  Contrib as ContributionType,
  ContribError as ContributionError,
} from 'helpers/contributions';
import type { Currency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';

import ContributionSelection from './contributionSelectionNewDesign';
import {
  changeContribType,
  changeContribAmountAnnual,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
  changeContribAmount,
} from '../../bundlesLandingActions';
import { getCardLink } from '../helpers/contributionLinks';


// ----- Props ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contributionType: ContributionType,
  country: IsoCountry,
  currency: Currency,
  selectedAmount: Amount,
  contributionError: ContributionError,
  changeContributionType: string => void,
  changeContributionAmountAnnual: string => void,
  changeContributionAmountMonthly: string => void,
  changeContributionAmountOneOff: string => void,
  setContributionCustomAmount: string => void,
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


// ----- Component ----- //

function Contribute(props: PropTypes) {

  return (
    <div className="contribute-new-design">
      <InfoSection
        heading="contribute"
        className="contribute-new-design__content gu-content-margin"
        headingContent={<div><Secure /><InlinePaymentLogos /></div>}
      >
        <Secure />
        <ContributionSelection
          contributionType={props.contributionType}
          country={props.country}
          currency={props.currency}
          selectedAmount={props.selectedAmount}
          toggleAmount={getAmountToggle(props)}
          toggleType={props.changeContributionType}
          setCustomAmount={props.setContributionCustomAmount}
        />
        <CtaLink
          ctaId="contribute"
          text="contribute with credit/debit"
          onClick={ctaClick(props)}
          id="qa-contribute-button"
          accessibilityHint="contribute with credit or debit card"
        />
      </InfoSection>
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Contribute);
