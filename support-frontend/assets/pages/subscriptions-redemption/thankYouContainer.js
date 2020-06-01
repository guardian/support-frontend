// @flow

import { connect } from 'react-redux';
import ThankYouContent from 'pages/digital-subscription-checkout/thankYouContent';
import type { RedemptionPageState } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { Stripe } from 'helpers/paymentMethods';

function mapStateToProps(state: RedemptionPageState) {
  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    paymentMethod: Stripe,
    includePaymentCopy: false,
  };
}

export default connect(mapStateToProps)(ThankYouContent);
