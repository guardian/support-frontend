// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import ContributionsCheckout from 'components/contributionsCheckout/contributionsCheckout';

import { type PageState as State } from '../oneOffContributionsReducer';
import OneoffInlineContributionsPayment from './oneoffInlineContributionsPayment';


// ----- State Maps ----- //

function mapStateToProps(state: State) {
  return {
    amount: state.page.oneoffContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    country: state.common.internationalisation.countryId,
    payment: <OneoffInlineContributionsPayment />,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsCheckout);
