// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionSelection from 'components/contributionSelection/contributionSelection';
import { getAmount } from 'components/contributionSelection/contributionSelectionReducer';
import { contributionSelectionActionsFor as actionsFor } from 'components/contributionSelection/contributionSelectionActions';

import type { State } from '../contributionsLandingReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    country: state.common.internationalisation.countryId,
    countryGroupId: state.common.internationalisation.countryGroupId,
    currencyId: state.common.internationalisation.currencyId,
    contributionType: state.page.selection.contributionType,
    selectedAmount: getAmount(state.page.selection),
    isCustomAmount: state.page.selection.isCustomAmount,
    error: state.page.selection.error,
    oneOffSingleOneTimeTestVariant: state.common.abParticipations.oneOffOneTimeSingle,
    usOneOffSingleOneTimeTestVariant: state.common.abParticipations.usOneOffOneTimeSingle,
    annualTestVariant: state.common.abParticipations.annualContributionsRoundThree,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps, actionsFor('CONTRIBUTE_SECTION'))(ContributionSelection);
