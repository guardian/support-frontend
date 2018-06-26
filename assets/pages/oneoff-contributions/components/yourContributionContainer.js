// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import YourContribution from 'components/yourContribution/yourContribution';

import type { PageState as State } from '../oneOffContributionsReducers';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    amount: state.page.oneoffContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(YourContribution);
