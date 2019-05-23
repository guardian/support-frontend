// @flow
import { connect } from 'react-redux';

import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
import { type CommonState } from 'helpers/page/commonReducer';
import { getWeeklyCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getPromoCode } from 'helpers/flashSale';
import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';
import { displayBillingPeriods } from 'helpers/productPrice/weeklyProductPrice';

import { type State } from '../weeklySubscriptionLandingReducer';


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
  plans: Object.keys(displayBillingPeriods).reduce((ps, billingPeriod) => {
    const period = displayBillingPeriods[billingPeriod];
    return {
      ...ps,
      [billingPeriod]: {
        title: period.title,
        copy: state.page.productPrices ? period.copy(
          state.common.internationalisation.countryId,
          state.page.productPrices,
        ) : '',
        offer: period.offer || null,
        href: getCheckoutUrl({ billingPeriod, state: state.common }),
        onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'GuardianWeekly', null, billingPeriod),
        price: null,
        saving: null,
      },
    };
  }, {}),
});


// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
