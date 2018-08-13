// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import ContributionsCheckout from 'components/contributionsCheckout/contributionsCheckout';

import { type PageState as State } from '../oneOffContributionsReducer';
import OneoffContributionsPayment from './oneoffContributionsPayment';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: state.page.oneoffContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    country: state.common.internationalisation.countryId,
    payment: <OneoffContributionsPayment />,
    name: state.page.user.displayName,
    isSignedIn: state.page.user.isSignedIn,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsCheckout);
