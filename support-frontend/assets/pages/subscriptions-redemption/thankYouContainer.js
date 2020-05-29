// @flow

import { connect } from 'react-redux';
import type { PropTypes } from 'pages/digital-subscription-checkout/thankYouContent';
import ThankYouContent from 'pages/digital-subscription-checkout/thankYouContent';
import type { RedemptionPageState } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { Monthly } from 'helpers/billingPeriods';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { DigitalPack } from 'helpers/subscriptions';
import { Corporate } from 'helpers/productPrice/productOptions';

function mapStateToProps(state: RedemptionPageState): PropTypes {
  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    title: null,
    firstName: state.page.user.firstName || '',
    lastName: state.page.user.lastName || '',
    email: state.page.user.email || '',
    telephone: null,
    titleGiftRecipient: null,
    firstNameGiftRecipient: null,
    lastNameGiftRecipient: null,
    emailGiftRecipient: null,
    billingPeriod: Monthly,
    paymentMethod: null,
    startDate: null,
    billingAddressIsSame: true,
    fulfilmentOption: NoFulfilmentOptions,
    product: DigitalPack,
    productOption: Corporate,
    orderIsAGift: null,
    deliveryInstructions: null,
    includePaymentCopy: false,
  };
}

export default connect(mapStateToProps)(ThankYouContent);
