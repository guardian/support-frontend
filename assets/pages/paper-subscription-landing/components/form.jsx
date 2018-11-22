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
  saturday: 2.9,
  sunday: 3,
};

const collectionPlans = {
  collectionEveryday: {
    title: 'Everyday',
    copy: 'Lorem ipsum sit amet',
    newsstand: (newsstandPrices.weekly * 5) + newsstandPrices.saturday + newsstandPrices.sunday,
  },
  collectionSixday: {
    title: 'Sixday',
    copy: 'Lorem ipsum sit amet',
    newsstand: (newsstandPrices.weekly * 5) + newsstandPrices.saturday,
  },
  collectionWeekend: {
    title: 'Weekend',
    copy: 'Lorem ipsum sit amet',
    newsstand: newsstandPrices.saturday + newsstandPrices.sunday,
  },
  collectionSunday: {
    title: 'Collect Sunday',
    copy: 'Lorem ipsum sit amet',
    newsstand: newsstandPrices.sunday,
  },
};

const deliveryPlans = {
  deliveryEveryday: {
    title: 'Everyday',
    copy: 'Lorem ipsum sit amet',
    newsstand: (newsstandPrices.weekly * 5) + newsstandPrices.saturday + newsstandPrices.sunday,
  },
  deliverySixday: {
    title: 'Sixday',
    copy: 'Lorem ipsum sit amet',
    newsstand: (newsstandPrices.weekly * 5) + newsstandPrices.saturday,
  },
  deliveryWeekend: {
    title: 'Weekend',
    copy: 'Lorem ipsum sit amet',
    newsstand: newsstandPrices.saturday + newsstandPrices.sunday,
  },
  deliverySunday: {
    title: 'Delivery Sunday',
    copy: 'Lorem ipsum sit amet',
    newsstand: newsstandPrices.sunday,
  },
};

const plans = {
  ...collectionPlans, ...deliveryPlans,
};


// ----- State/Props Maps ----- //

const getSaving = (subscription: number, newsstand: number) => Math.floor(((newsstand * 4) - subscription) * 100) / 100;

const getPriceStr = (price: Option<number>): Option<string> =>
  (price ? `From £${price} per month` : null);
const getSavingStr = (subscription: Option<number>, newsstand: number): Option<string> =>
  (subscription ? `save £${getSaving(subscription, newsstand)} a month` : null);

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
