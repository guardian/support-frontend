// @flow
import { connect } from 'react-redux';

import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
import {
  billingPeriodTitle,
  weeklyBillingPeriods,
} from 'helpers/billingPeriods';
import { type CommonState } from 'helpers/page/commonReducer';
import { getWeeklyCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getPromoCode } from 'helpers/flashSale';
import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../weeklySubscriptionLandingReducer';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import {
  getAppliedPromoDescription,
  getPriceDescription,
} from 'helpers/productPrice/priceDescriptions';
import { getWeeklyFulfilmentOption } from 'helpers/productPrice/fulfilmentOptions';

// ---- Plans ----- //

const getCheckoutUrl = ({ billingPeriod, state }: {billingPeriod: WeeklyBillingPeriod, state: CommonState}): string => {
  const {
    internationalisation: { countryGroupId }, referrerAcquisitionData, abParticipations, optimizeExperiments,
  } = state;

  return getWeeklyCheckout(
    referrerAcquisitionData,
    billingPeriod,
    countryGroupId,
    abParticipations,
    optimizeExperiments,
    (billingPeriod === 'Annual' ? getPromoCode('GuardianWeekly', countryGroupId, '10ANNUAL') : null),
  );
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
    ) : { price: 0, currency: 'GBP' };
    const clickHandler = (bp) => {
      // The following is a temporary fix until there is a url builder for the weekly checkout
      window.localStorage.setItem('billingPeriodSelected', bp);
      sendTrackingEventsOnClick('subscribe_now_cta', 'GuardianWeekly', null, bp);
    };
    return {
      ...plans,
      [billingPeriod]: {
        title: billingPeriodTitle(billingPeriod),
        copy: getPriceDescription(
          productPrice,
          billingPeriod,
        ),
        offer: getAppliedPromoDescription(billingPeriod, productPrice),
        href: getCheckoutUrl({ billingPeriod, state: state.common }),
        onClick: () => clickHandler(billingPeriod),
        price: null,
        saving: null,
      },
    };
  }, {}),
});

// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
