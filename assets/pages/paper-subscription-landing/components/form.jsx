// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Option } from 'helpers/types/option';
import { getNewsstandSaving, getNewsstandPrice, type PaperBillingPlan, getPaperPrice } from 'helpers/subscriptions';
import { showPrice, type Price } from 'helpers/internationalisation/price';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setPlan, redirectToCheckout } from '../paperSubscriptionLandingPageActions';


// ---- Helpers ----- //

const getPriceStr = (price: Price): string =>
  `Monthly price ${showPrice(price)}`;

const getSavingStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> =>
  (subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0 ? `Save £${getNewsstandSaving(subscription, newsstand)} a month on retail price` : null);


// ---- Plans ----- //

const allPlans = {
  collectionEveryday: {
    title: 'Every day',
    copy: 'Every issue of The Guardian and The Observer, from Monday to Sunday',
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
    price: getPaperPrice('collectionEveryday'),
  },
  collectionSixday: {
    title: 'Monday to Saturday',
    copy: 'Every issue of The Guardian, from Monday to Saturday',
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
    price: getPaperPrice('collectionSixday'),
  },
  collectionWeekend: {
    title: 'Weekend',
    copy: 'The Guardian every Saturday and The Observer every Sunday',
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
    price: getPaperPrice('collectionWeekend'),
  },
  collectionSunday: {
    title: 'Sunday',
    copy: 'The Observer every Sunday',
    newsstand: getNewsstandPrice(['sunday']),
    price: getPaperPrice('collectionSunday'),
  },
  deliveryEveryday: {
    title: 'Every day',
    copy: 'Every issue of The Guardian and The Observer, from Monday to Sunday',
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
    price: getPaperPrice('deliveryEveryday'),
  },
  deliverySixday: {
    title: 'Monday to Saturday',
    copy: 'Every issue of The Guardian, from Monday to Saturday',
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
    price: getPaperPrice('deliverySixday'),
  },
  deliveryWeekend: {
    title: 'Weekend',
    copy: 'The Guardian every Saturday and The Observer every Sunday',
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
    price: getPaperPrice('deliveryWeekend'),
  },
  deliverySunday: {
    title: 'Sunday',
    copy: 'The Observer every Sunday',
    newsstand: getNewsstandPrice(['sunday']),
    price: getPaperPrice('deliverySunday'),
  },
};


// ----- State/Props Maps ----- //
const mapStateToProps = (state: State): StatePropTypes<PaperBillingPlan> => {
  const transformPlans = (plans: $Keys<typeof allPlans>[]) => plans.reduce((ps, k) => ({
    ...ps,
    [k]: {
      title: allPlans[k].title,
      copy: allPlans[k].copy,
      price: getPriceStr(allPlans[k].price),
      offer: getSavingStr(allPlans[k].price.value, allPlans[k].newsstand ? allPlans[k].newsstand : null),
    },
  }), {});

  if (state.page.tab === 'collection') {
    return {
      plans: transformPlans(['collectionEveryday', 'collectionSixday', 'collectionWeekend', 'collectionSunday']),
      selectedPlan: state.page.plan.plan,
    };
  }

  return {
    plans: transformPlans(['deliveryEveryday', 'deliverySixday', 'deliveryWeekend', 'deliverySunday']),
    selectedPlan: state.page.plan.plan,
  };


};

const mapDispatchToProps = (dispatch: Dispatch<Action<PaperBillingPlan>>): DispatchPropTypes<PaperBillingPlan> =>
  ({
    setPlanAction: bindActionCreators(setPlan, dispatch),
    onSubmitAction: bindActionCreators(redirectToCheckout, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePlanForm);
