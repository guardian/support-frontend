// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import InfoSection from 'components/infoSection/infoSection';
import { contribCamelCase } from 'helpers/contributions';

import type { Contrib as ContributionType } from 'helpers/contributions';
import type { Currency } from 'helpers/internationalisation/currency';

import ContributionSelection from './contributionSelectionNewDesign';
import {
  changeContribAmountAnnual,
  changeContribAmountMonthly,
  changeContribAmountOneOff,
} from '../../bundlesLandingActions';


// ----- Props ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contributionType: ContributionType,
  currency: Currency,
  selectedAmount: string,
  changeContribAmountAnnual: string => void,
  changeContribAmountMonthly: string => void,
  changeContribAmountOneOff: string => void,
};

/* eslint-enable react/no-unused-prop-types */

function mapStateToProps(state) {

  const contributionTypeCamelCase = contribCamelCase(state.page.type);

  return {
    contributionType: state.page.type,
    currency: state.common.currency,
    selectedAmount: state.page.amount[contributionTypeCamelCase].value,
  };

}

function mapDispatchToProps(dispatch) {

  return {
    changeContribAmountAnnual: (value: string) => {
      dispatch(changeContribAmountAnnual({ value, userDefined: false }));
    },
    changeContribAmountMonthly: (value: string) => {
      dispatch(changeContribAmountMonthly({ value, userDefined: false }));
    },
    changeContribAmountOneOff: (value: string) => {
      dispatch(changeContribAmountOneOff({ value, userDefined: false }));
    },
  };

}


// ----- Functions ----- //

function getAmountToggle(props: PropTypes) {

  switch (props.contributionType) {
    case 'ANNUAL': return props.changeContribAmountAnnual;
    case 'MONTHLY': return props.changeContribAmountMonthly;
    default: return props.changeContribAmountOneOff;
  }

}


// ----- Component ----- //

function Contribute(props: PropTypes) {

  return (
    <div className="contribute-new-design">
      <InfoSection
        heading="contribute"
        className="contribute-new-design__content gu-content-margin"
      >
        <ContributionSelection
          currency={props.currency}
          contributionType={props.contributionType}
          selectedAmount={props.selectedAmount}
          toggleAmount={getAmountToggle(props)}
        />
      </InfoSection>
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(Contribute);
