// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionSelection from 'components/contributionSelection/contributionSelection';
import {
  getAmount,
} from 'components/contributionSelection/contributionSelectionReducer';
import {
  contributionSelectionActionsFor as actionsFor,
} from 'components/contributionSelection/contributionSelectionActions';

import type { State } from '../supportLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    country: state.common.country,
    currency: state.common.currency,
    contributionType: state.page.selection.contributionType,
    selectedAmount: getAmount(state.page.selection),
    isCustomAmount: state.page.selection.isCustomAmount,
    error: state.page.selection.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, actionsFor('CONTRIBUTE_SECTION'))(ContributionSelection);
