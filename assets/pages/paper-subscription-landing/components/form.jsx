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
  `From ${showPrice(price)} per month`;

const getSavingStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> =>
  (subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0 ? `Save £${getNewsstandSaving(subscription, newsstand)} a month on retail price` : null);


// ---- Plans ----- //

const allPlans = {
  collectionEveryday: {
    title: 'Everyday',
    copy: 'Receive vouchers to enjoy every issue of The Guardian and The Observer, from Monday to Sunday',
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
    price: getPaperPrice('collectionEveryday'),
  },
  collectionSixday: {
    title: 'Sixday',
    copy: 'We\'ll send you vouchers to pick up every issue of The Guardian, from Monday to Saturday',
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
    price: getPaperPrice('collectionSixday'),
  },
  collectionWeekend: {
    title: 'Weekend',
    copy: 'Make more of your weekend, with vouchers for The Guardian every Saturday and The Observer every Sunday',
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
    price: getPaperPrice('collectionWeekend'),
  },
  collectionSunday: {
    title: 'Sunday',
    copy: 'Get vouchers to pick up The Observer newspaper every Sunday',
    newsstand: getNewsstandPrice(['sunday']),
    price: getPaperPrice('collectionSunday'),
  },
  deliveryEveryday: {
    title: 'Everyday',
    copy: 'Enjoy every issue of The Guardian and Observer newspapers from Monday to Sunday, delivered to your home',
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
    price: getPaperPrice('deliveryEveryday'),
  },
  deliverySixday: {
    title: 'Sixday',
    copy: 'Get every issue of The Guardian delivered to your front door, from Monday to Saturday',
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
    price: getPaperPrice('deliverySixday'),
  },
  deliveryWeekend: {
    title: 'Weekend',
    copy: 'Make more of every weekend with The Guardian on Saturday and The Observer on Sunday, delivered to your home',
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
    price: getPaperPrice('deliveryWeekend'),
  },
  deliverySunday: {
    title: 'Sunday',
    copy: 'Relax with The Observer every Sunday, delivered to your doormat',
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
      offer: null,
      price: getPriceStr(allPlans[k].price),
      saving: getSavingStr(allPlans[k].price.value, allPlans[k].newsstand ? allPlans[k].newsstand : null),
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
