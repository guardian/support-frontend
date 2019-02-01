// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Option } from 'helpers/types/option';
import { getNewsstandSaving, getNewsstandPrice, type PaperBillingPlan, getPaperPrice, getRegularPaperPrice } from 'helpers/subscriptions';
import { showPrice, type Price } from 'helpers/internationalisation/price';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';
import { flashSaleIsActive, getDuration } from 'helpers/flashSale';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import { setPlan, redirectToCheckout } from '../../paperSubscriptionLandingPageActions';


// ---- Helpers ----- //

const getRegularPriceStr = (price: Price): string => `You pay ${showPrice(price)} a month`;


const getPriceStr = (price: Price): string => {
  if (flashSaleIsActive('Paper', 'GBPCountries')) {
    const duration = getDuration('Paper', 'GBPCountries');
    if (duration) {
      return `You pay ${showPrice(price)} a month for ${duration}`;
    }
    return getRegularPriceStr(price);
  }
  return getRegularPriceStr(price);
};

const getOfferStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> =>
  (subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0 ? `Save £${getNewsstandSaving(subscription, newsstand)} a month on retail price` : null);

const getSavingStr = (price: Price): Option<string> => (flashSaleIsActive('Paper', 'GBPCountries') && getDuration('Paper', 'GBPCountries') ? `${showPrice(price)} a month thereafter` : null);


// ---- Plans ----- //

const collectionCopy = 'Collect your papers from your local retailer';
const deliveryCopy = 'Have your papers delivered to your home';

const allPlans = {
  collectionEveryday: {
    title: 'Every day',
    copy: collectionCopy,
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
    price: getPaperPrice('collectionEveryday'),
    regularPrice: getRegularPaperPrice('collectionEveryday'),
  },
  collectionSixday: {
    title: 'Monday to Saturday',
    copy: collectionCopy,
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
    price: getPaperPrice('collectionSixday'),
    regularPrice: getRegularPaperPrice('collectionSixday'),
  },
  collectionWeekend: {
    title: 'Weekend',
    copy: collectionCopy,
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
    price: getPaperPrice('collectionWeekend'),
    regularPrice: getRegularPaperPrice('collectionWeekend'),
  },
  collectionSunday: {
    title: 'Sunday',
    copy: collectionCopy,
    newsstand: getNewsstandPrice(['sunday']),
    price: getPaperPrice('collectionSunday'),
    regularPrice: getRegularPaperPrice('collectionSunday'),
  },
  deliveryEveryday: {
    title: 'Every day',
    copy: deliveryCopy,
    newsstand: getNewsstandPrice(['weekly', 'saturday', 'sunday']),
    price: getPaperPrice('deliveryEveryday'),
    regularPrice: getRegularPaperPrice('deliveryEveryday'),
  },
  deliverySixday: {
    title: 'Monday to Saturday',
    copy: deliveryCopy,
    newsstand: getNewsstandPrice(['weekly', 'saturday']),
    price: getPaperPrice('deliverySixday'),
    regularPrice: getRegularPaperPrice('deliverySixday'),
  },
  deliveryWeekend: {
    title: 'Weekend',
    copy: deliveryCopy,
    newsstand: getNewsstandPrice(['saturday', 'sunday']),
    price: getPaperPrice('deliveryWeekend'),
    regularPrice: getRegularPaperPrice('deliveryWeekend'),
  },
  deliverySunday: {
    title: 'Sunday',
    copy: deliveryCopy,
    newsstand: getNewsstandPrice(['sunday']),
    price: getPaperPrice('deliverySunday'),
    regularPrice: getRegularPaperPrice('deliverySunday'),
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
      offer: getOfferStr(allPlans[k].price.value, allPlans[k].newsstand ? allPlans[k].newsstand : null),
      saving: getSavingStr(allPlans[k].regularPrice),
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
