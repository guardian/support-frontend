// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import YourContribution from 'components/yourContribution/yourContribution';

import type { PageState as State } from '../oneOffContributionsReducers';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    amount: state.page.oneoffContrib.amount,
    currency: state.common.currency,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(YourContribution);
