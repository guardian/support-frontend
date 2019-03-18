// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Option } from 'helpers/types/option';
import { getNewsstandPrice, getNewsstandSaving } from 'helpers/subscriptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { type Price, showPrice } from 'helpers/productPrice/productPrices';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, {
  type DispatchPropTypes,
  type StatePropTypes,
} from 'components/productPage/productPagePlanForm/productPagePlanForm';
import { flashSaleIsActive, getDuration } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import { redirectToCheckout, setPlan } from '../../paperSubscriptionLandingPageActions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes, Everyday, Sixday } from 'helpers/productPrice/productOptions';
import { finalPrice, regularPrice } from 'helpers/productPrice/paperProductPrices';


// ---- Helpers ----- //
// TODO: We will need to make this work for flash sales
const getRegularPriceStr = (price: Price): string => `You pay ${showPrice(price)} a month`;

const getPriceStr = (price: Price): string => {
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const duration = getDuration('Paper', GBPCountries);
    if (duration) {
      return `You pay ${showPrice(price)} a month for ${duration}`;
    }
    return getRegularPriceStr(price);
  }
  return getRegularPriceStr(price);
};

const getOfferStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> => {
  if ((subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0)) {
    return `Save £${getNewsstandSaving(subscription, newsstand)} a month on retail price`;
  }
  return null;
};

const getSavingStr = (price: Price): Option<string> => {
  if (flashSaleIsActive('Paper', GBPCountries) && getDuration('Paper', GBPCountries)) {
    return `${showPrice(price)} a month thereafter`;
  }
  return null;
};


// ---- Plans ----- //

const getTitle = (productOption: PaperProductOptions) => {
  switch (productOption) {
    case Everyday:
      return 'Every day';
    case Sixday:
      return 'Monday to Saturday';
    default:
      return productOption;
  }
};

const copy = {
  HomeDelivery: 'Have your papers delivered to your home',
  Collection: 'Collect your papers from your local retailer',
};

const getPlans = (fulfilmentOption: PaperFulfilmentOptions, productPrices: ProductPrices) =>
  ActivePaperProductTypes.reduce((products, productOption) => {
    const price = finalPrice(productPrices, fulfilmentOption, productOption);
    return {
      ...products,
      [productOption]: {
        title: getTitle(productOption),
        copy: copy[fulfilmentOption],
        price: getPriceStr(price),
        offer: getOfferStr(price.price, getNewsstandPrice(productOption)),
        saving: getSavingStr(regularPrice(productPrices, fulfilmentOption, productOption)),
      },
    };
  }, {});


// ----- State/Props Maps ----- //
const mapStateToProps = (state: State): StatePropTypes<PaperProductOptions> => ({
  plans: getPlans(state.page.tab, state.page.productPrices),
  selectedPlan: state.page.plan.plan,
});

const mapDispatchToProps = (dispatch: Dispatch<Action<PaperProductOptions>>): DispatchPropTypes<PaperProductOptions> =>
  ({
    setPlanAction: bindActionCreators(setPlan, dispatch),
    onSubmitAction: bindActionCreators(redirectToCheckout, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePlanForm);
