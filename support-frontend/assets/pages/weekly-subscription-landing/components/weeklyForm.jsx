// @flow
import { connect } from 'react-redux';

import {
  SixWeekly,
  billingPeriodTitle,
  weeklyBillingPeriods,
  type WeeklyBillingPeriod,
} from 'helpers/billingPeriods';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../weeklySubscriptionLandingReducer';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import {
  getAppliedPromoDescription,
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';
import { getOrigin, getQueryParameter } from 'helpers/url';
import { promoQueryParam } from 'helpers/productPrice/promotions';

// ---- Plans ----- //

const getCheckoutUrl = (billingPeriod: WeeklyBillingPeriod, orderIsGift: boolean): string => {
  const promoCode = getQueryParameter(promoQueryParam);
  const promoQuery = promoCode ? `&${promoQueryParam}=${promoCode}` : '';
  const gift = orderIsGift ? '/gift' : '';
  return `${getOrigin()}/subscribe/weekly/checkout${gift}?period=${billingPeriod.toString()}${promoQuery}`;
};

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): PropTypes<WeeklyBillingPeriod> => {
  const { countryId } = state.common.internationalisation;
  const { productPrices, orderIsAGift } = state.page;
  const billingPeriodsToUse = weeklyBillingPeriods.filter(billingPeriod =>
    !(state.page.orderIsAGift && billingPeriod === SixWeekly));

  return {
    plans: billingPeriodsToUse.reduce((plans, billingPeriod) => {
      const productPrice = productPrices ? getProductPrice(
        productPrices,
        countryId,
        billingPeriod,
        getWeeklyFulfilmentOption(countryId),
      ) : { price: 0, fixedTerm: false, currency: 'GBP' };
      return {
        ...plans,
        [billingPeriod]: {
          title: billingPeriodTitle(billingPeriod, orderIsAGift),
          copy: getPriceDescription(
            productPrice,
            billingPeriod,
          ),
          offer: getAppliedPromoDescription(billingPeriod, productPrice),
          href: getCheckoutUrl(billingPeriod, orderIsAGift),
          onClick: sendTrackingEventsOnClick(`subscribe_now_cta-${billingPeriod}`, 'GuardianWeekly', null),
          price: null,
          saving: null,
        },
      };
    }, {}),
  };
};


// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
