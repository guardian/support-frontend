// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Option } from 'helpers/types/option';
import { getNewsstandSaving, getNewsstandPrice, type PaperBillingPlan } from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setPlan } from '../paperSubscriptionLandingPageActions';


// ---- Helpers ----- //

const getPriceStr = (price: Option<number>): Option<string> =>
  (price ? `From £${price} per month` : null);

const getSavingStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> =>
  (subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0 ? `Save £${getNewsstandSaving(subscription, newsstand)} a month on retail price` : null);


// ---- Plans ----- //

const collectionPlans = {
  collectionEveryday: {
    title: 'Everyday',
    copy: 'Receive vouchers to enjoy every issue of The Guardian and The Observer, from Monday to Sunday',
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
  },
  collectionSixday: {
    title: 'Sixday',
    copy: 'We\'ll send you vouchers to pick up every issue of The Guardian, from Monday to Saturday',
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
  },
  collectionWeekend: {
    title: 'Weekend',
    copy: 'Make more of your weekend, with vouchers for The Guardian every Saturday and The Observer every Sunday',
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
  },
  collectionSunday: {
    title: 'Sunday',
    copy: 'Get vouchers to pick up The Observer newspaper every Sunday',
    newsstand: getNewsstandPrice(['sunday']),
  },
};

const deliveryPlans = {
  deliveryEveryday: {
    title: 'Everyday',
    copy: 'Enjoy every issue of The Guardian and Observer newspapers from Monday to Sunday, delivered to your home',
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
  },
  deliverySixday: {
    title: 'Sixday',
    copy: 'Get every issue of The Guardian delivered to your front door, from Monday to Saturday',
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
  },
  deliveryWeekend: {
    title: 'Weekend',
    copy: 'Make more of every weekend with The Guardian on Saturday and The Observer on Sunday, delivered to your home',
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
  },
  deliverySunday: {
    title: 'Sunday',
    copy: 'Relax with The Observer every Sunday, delivered to your doormat',
    newsstand: getNewsstandPrice(['sunday']),
  },
};

const plans = {
  ...collectionPlans, ...deliveryPlans,
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<PaperBillingPlan> => ({
  plans: Object.keys(plans).reduce((ps, k) => ({
    ...ps,
    [k]: {
      title: plans[k].title,
      copy: plans[k].copy,
      offer: null,
      price: getPriceStr(state.page.prices[k]),
      saving: getSavingStr(state.page.prices[k], plans[k].newsstand ? plans[k].newsstand : null),
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
