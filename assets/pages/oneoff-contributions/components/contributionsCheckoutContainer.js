// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionsCheckout from 'components/contributionsCheckout/contributionsCheckout';

import { type State } from '../oneOffContributionsReducer';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: state.page.oneoffContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    name: state.page.user.displayName,
    isSignedIn: state.page.user.isSignedIn,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsCheckout);
