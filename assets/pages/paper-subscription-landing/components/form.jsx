// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Option } from 'helpers/types/option';
import { type PaperBillingPlan } from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setPlan } from '../paperSubscriptionLandingPageActions';


// ---- Plans ----- //

const newsstandPrices = {
  weekly: 2,
  saturday: 3,
  sunday: 3.25,
};

const collectionPlans = {
  collectionEveryday: {
    title: 'Everyday',
    copy: 'Receive vouchers to enjoy every issue of The Guardian and The Observer, from Monday to Sunday',
    newsstand: (newsstandPrices.weekly * 5) + newsstandPrices.saturday + newsstandPrices.sunday,
  },
  collectionSixday: {
    title: 'Sixday',
    copy: 'We\'ll send you vouchers to pick up every issue of The Guardian, from Monday to Saturday',
    newsstand: (newsstandPrices.weekly * 5) + newsstandPrices.saturday,
  },
  collectionWeekend: {
    title: 'Weekend',
    copy: 'Make more of your weekend, with vouchers for The Guardian every Saturday and The Observer every Sunday',
    newsstand: newsstandPrices.saturday + newsstandPrices.sunday,
  },
  collectionSunday: {
    title: 'Sunday',
    copy: 'Get vouchers to pick up The Observer newspaper every Sunday',
    newsstand: newsstandPrices.sunday,
  },
};

const deliveryPlans = {
  deliveryEveryday: {
    title: 'Everyday',
    copy: 'Enjoy every issue of The Guardian and Observer newspapers from Monday to Sunday, delivered to your home',
  },
  deliverySixday: {
    title: 'Sixday',
    copy: 'Get every issue of The Guardian delivered to your front door, from Monday to Saturday',
  },
  deliveryWeekend: {
    title: 'Weekend',
    copy: 'Make more of every weekend with The Guardian on Saturday and The Observer on Sunday, delivered to your home',
  },
  deliverySunday: {
    title: 'Sunday',
    copy: 'Relax with The Observer every Sunday, delivered to your doormat',
  },
};

const plans = {
  ...collectionPlans, ...deliveryPlans,
};


// ----- State/Props Maps ----- //

const getSaving = (subscription: number, newsstand: number) => Math.floor(((newsstand * 4) - subscription) * 100) / 100;

const getPriceStr = (price: Option<number>): Option<string> =>
  (price ? `From £${price} per month` : null);
const getSavingStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> =>
  (subscription && newsstand ? `save £${getSaving(subscription, newsstand)} a month` : null);

const mapStateToProps = (state: State): StatePropTypes<PaperBillingPlan> => ({
  plans: Object.keys(plans).reduce((ps, k) => ({
    ...ps,
    [k]: {
      title: plans[k].title,
      copy: plans[k].copy,
      offer: null,
      price: getPriceStr(state.page.prices[k]),
      saving: getSavingStr(state.page.prices[k], plans[k].newsstand),
    },
  }), {}),
  selectedPlan: state.page.plan.plan,
});

const mapDispatchToProps = (dispatch: Dispatch<Action<PaperBillingPlan>>): DispatchPropTypes<PaperBillingPlan> =>
  ({
    setPlanAction: bindActionCreators(setPlan, dispatch),
    onSubmitAction: bindActionCreators(() => null, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePlanForm);
