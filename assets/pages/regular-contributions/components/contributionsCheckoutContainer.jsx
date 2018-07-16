// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import ContributionsCheckout from 'components/contributionsCheckout/contributionsCheckout';

import { type PageState as State } from '../regularContributionsReducer';
import RegularInlineContributionsPayment from './regularContributionsPayment';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: state.page.regularContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    country: state.common.internationalisation.countryId,
    payment: <RegularInlineContributionsPayment />,
    name: state.page.user.displayName,
    isSignedIn: state.page.user.isSignedIn,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsCheckout);
