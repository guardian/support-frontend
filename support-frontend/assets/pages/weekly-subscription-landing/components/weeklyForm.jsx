// @flow
import { connect } from 'react-redux';

import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
import {
  billingPeriodTitle,
  weeklyBillingPeriods,
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

const getCheckoutUrl = (billingPeriod: WeeklyBillingPeriod): string => {
  const promoCode = getQueryParameter(promoQueryParam);
  const promoQuery = promoCode ? `&${promoQueryParam}=${promoCode}` : '';
  return `${getOrigin()}/subscribe/weekly/checkout?period=${billingPeriod.toString()}${promoQuery}`;
};

// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): PropTypes<WeeklyBillingPeriod> => ({
  plans: weeklyBillingPeriods.reduce((plans, billingPeriod) => {
    const { countryId } = state.common.internationalisation;
    const { productPrices } = state.page;
    const productPrice = productPrices ? getProductPrice(
      productPrices,
      countryId,
      billingPeriod,
      getWeeklyFulfilmentOption(countryId),
    ) : { price: 0, fixedTerm: false, currency: 'GBP' };
    return {
      ...plans,
      [billingPeriod]: {
        title: billingPeriodTitle(billingPeriod),
        copy: getPriceDescription(
          productPrice,
          billingPeriod,
        ),
        offer: getAppliedPromoDescription(billingPeriod, productPrice),
        href: getCheckoutUrl(billingPeriod),
        onClick: sendTrackingEventsOnClick(`subscribe_now_cta-${billingPeriod}`, 'GuardianWeekly', null),
        price: null,
        saving: null,
      },
    };
  }, {}),
});


// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
