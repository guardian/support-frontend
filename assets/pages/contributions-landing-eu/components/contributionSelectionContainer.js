// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionSelection from 'containerisableComponents/contributionSelection/contributionSelection';
import { getAmount } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import { contributionSelectionActionsFor as actionsFor } from 'containerisableComponents/contributionSelection/contributionSelectionActions';

import type { State } from '../contributionsLandingEUReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    country: state.common.country,
    countryGroupId: state.common.countryGroup,
    currency: state.common.currency,
    contributionType: state.page.selection.contributionType,
    selectedAmount: getAmount(state.page.selection),
    isCustomAmount: state.page.selection.isCustomAmount,
    error: state.page.selection.error,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, actionsFor('CONTRIBUTE_SECTION'))(ContributionSelection);
