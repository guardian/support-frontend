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

import type { State } from '../contributionsLandingUK';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    country: state.common.country,
    currency: state.common.currency,
    contributionType: state.page.contributionType,
    selectedAmount: getAmount(state.page),
    isCustomAmount: state.page.isCustomAmount,
    error: state.page.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, actionsFor('CONTRIBUTE_SECTION'))(ContributionSelection);
