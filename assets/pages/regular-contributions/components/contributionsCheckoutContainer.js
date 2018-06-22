// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import ContributionsCheckout from 'components/contributionsCheckout/contributionsCheckout';

import { type PageState as State } from '../regularContributionsReducers';
import RegularContributionsPayment from './regularContributionsPayment';
import RegularInlineContributionsPayment from './regularInlineContributionsPayment';


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  const inlineCardPaymentVariant = state.common.abParticipations.inlineStripeFlowCardPayment;

  return {
    amount: state.page.regularContrib.amount,
    currency: state.common.currency,
    country: state.common.country,
    inlineCardPaymentVariant,
    payment: inlineCardPaymentVariant === 'inline' ?
      RegularInlineContributionsPayment :
      RegularContributionsPayment,
  };

}


// ----- Exports ----- //

export default connect(mapStateToProps)(ContributionsCheckout);
