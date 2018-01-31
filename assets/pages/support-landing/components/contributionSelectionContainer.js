// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionSelection from 'components/contributionSelection/contributionSelection';
import {
  getAmount,
  isCustomAmount,
} from 'components/contributionSelection/contributionSelectionReducer';

import type { State } from '../supportLanding';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    country: state.common.country,
    currency: state.common.currency,
    contributionType: state.page.contributionType,
    selectedAmount: getAmount(state.page),
    isCustomAmount: isCustomAmount(state.page),
    error: state.page.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionSelection);
