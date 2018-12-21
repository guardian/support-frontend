// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import {
  type WeeklyBillingPeriod,
  getWeeklyProductPrice,
  getPromotionWeeklyProductPrice,
} from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../weeklySubscriptionLandingReducer';
import { redirectToWeeklyPage, setPlan } from '../weeklySubscriptionLandingActions';


// ---- Plans ----- //

const getPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getWeeklyProductPrice(countryGroupId, period),
].join('');

const getPromotionPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod, promoCode: string) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getPromotionWeeklyProductPrice(countryGroupId, period, promoCode),
].join('');

export const billingPeriods = {
  sixweek: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'sixweek')} for the first 6 issues (then ${getPrice(countryGroupId, 'quarter')} quarterly)`,
  },
  quarter: {
    title: 'Quarterly',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'quarter')} every 3 months`,
  },
  year: {
    title: 'Annually',
    offer: 'Save 10%',
    copy: (countryGroupId: CountryGroupId) => `${getPromotionPrice(countryGroupId, 'year', '10ANNUAL')} for 1 year, then standard rate (${getPrice(countryGroupId, 'year')} every year)`,
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<WeeklyBillingPeriod> => ({
  plans: Object.keys(billingPeriods).reduce((ps, k) => ({
    ...ps,
    [k]: {
      title: billingPeriods[k].title,
      copy: billingPeriods[k].copy(state.common.internationalisation.countryGroupId),
      offer: billingPeriods[k].offer || null,
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
