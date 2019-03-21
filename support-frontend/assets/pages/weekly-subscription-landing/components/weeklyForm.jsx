// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import type { WeeklyBillingPeriod } from 'helpers/billingPeriods';
import { type CommonState } from 'helpers/page/commonReducer';
import { Annual, Quarterly } from 'helpers/billingPeriods';
import { getWeeklyCheckout } from 'helpers/externalLinks';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getPromoCode } from 'helpers/flashSale';
import { getPromotionWeeklyProductPrice, getWeeklyProductPrice } from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, {
  type DispatchPropTypes,
  type StatePropTypes,
} from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../weeklySubscriptionLandingReducer';
import { redirectToWeeklyPage, setPlan } from '../weeklySubscriptionLandingActions';


// ---- Plans ----- //

const getCheckoutUrl = ({ billingPeriod, state }: {billingPeriod: WeeklyBillingPeriod, state: CommonState}): string => {

  const {
    internationalisation: { countryGroupId }, referrerAcquisitionData, abParticipations, optimizeExperiments,
  } = state;
  const location = getWeeklyCheckout(
    referrerAcquisitionData,
    billingPeriod,
    countryGroupId,
    abParticipations,
    optimizeExperiments,
    (billingPeriod === 'Annual' ? getPromoCode('GuardianWeekly', countryGroupId, '10ANNUAL') : null),
  );

  return location;
};


const getPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getWeeklyProductPrice(countryGroupId, period),
].join('');

const getPromotionPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod, promoCode: string) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getPromotionWeeklyProductPrice(countryGroupId, period, promoCode),
].join('');

export const displayBillingPeriods = {
  [Quarterly]: {
    title: 'Quarterly',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'Quarterly')} every 3 months`,
  },
  [Annual]: {
    title: 'Annually',
    offer: 'Save 10%',
    copy: (countryGroupId: CountryGroupId) => `${getPromotionPrice(countryGroupId, 'Annual', '10ANNUAL')} for 1 year, then standard rate (${getPrice(countryGroupId, 'Annual')} every year)`,
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<WeeklyBillingPeriod> => ({
  plans: Object.keys(displayBillingPeriods).reduce((ps, billingPeriod) => ({
    ...ps,
    [billingPeriod]: {
      title: displayBillingPeriods[billingPeriod].title,
      copy: displayBillingPeriods[billingPeriod].copy(state.common.internationalisation.countryGroupId),
      offer: displayBillingPeriods[billingPeriod].offer || null,
      href: getCheckoutUrl({ billingPeriod, state: state.common }),
      onClick: sendTrackingEventsOnClick('main_cta_click', 'GuardianWeekly', null, billingPeriod),
      price: null,
      saving: null,
    },
  }), {}),
  selectedPlan: state.page.plan,
});

const mapDispatchToProps = (dispatch: Dispatch<Action<WeeklyBillingPeriod>>): DispatchPropTypes<WeeklyBillingPeriod> =>
  ({
    setPlanAction: bindActionCreators(setPlan, dispatch),
    onSubmitAction: bindActionCreators(redirectToWeeklyPage, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePlanForm);
