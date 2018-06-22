// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionsCheckout from 'components/contributionsCheckout/contributionsCheckout';

import { type PageState as State } from '../oneOffContributionsReducers';
import OneoffContributionsPayment from './oneoffContributionsPayment';
import OneoffInlineContributionsPayment from './oneoffInlineContributionsPayment';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  const inlineCardPaymentVariant = state.common.abParticipations.inlineStripeFlowCardPayment;

  return {
    amount: state.page.oneoffContrib.amount,
    currency: state.common.currency,
    country: state.common.country,
    inlineCardPaymentVariant,
    payment: inlineCardPaymentVariant === 'inline' ?
      OneoffInlineContributionsPayment :
      OneoffContributionsPayment,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsCheckout);
