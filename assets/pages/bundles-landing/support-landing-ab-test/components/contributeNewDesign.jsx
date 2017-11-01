// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import InfoSection from 'components/infoSection/infoSection';

import type { Contrib as ContributionType } from 'helpers/contributions';
import type { Currency } from 'helpers/internationalisation/currency';

import ContributionSelection from './contributionSelectionNewDesign';


// ----- Props ----- //

type PropTypes = {
  contributionType: ContributionType,
  currency: Currency,
  selectedAmount: string,
};

function mapStateToProps(state) {

  return {
    contributionType: state.page.type,
    currency: state.common.currency,
    selectedAmount: state.page.amount.monthly.value,
  };

}


// ----- Component ----- //

function Contribute(props: PropTypes) {

  return (
    <div className="contribute-new-design">
      <InfoSection heading="contribute" className="contribute-new-design__content gu-content-margin">
        <ContributionSelection
          currency={props.currency}
          contributionType={props.contributionType}
          selectedAmount={props.selectedAmount}
        />
      </InfoSection>
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(Contribute);
