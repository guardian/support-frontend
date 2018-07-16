// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import ContributionsCheckout from 'components/contributionsCheckout/contributionsCheckout';

import { type PageState as State } from '../regularContributionsReducer';
import RegularInlineContributionsPayment from './regularInlineContributionsPayment';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: state.page.regularContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    country: state.common.internationalisation.countryId,
    payment: <RegularInlineContributionsPayment />,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsCheckout);
