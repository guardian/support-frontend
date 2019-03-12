// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Option } from 'helpers/types/option';
import { getNewsstandSaving, getNewsstandPrice } from 'helpers/subscriptions';
import { type Price, showPrice } from 'helpers/productPrice/productPrices';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';
import { flashSaleIsActive, getDuration } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import { setPlan, redirectToCheckout } from '../../paperSubscriptionLandingPageActions';
import { Collection } from 'helpers/productPrice/fulfilmentOptions';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { Everyday, PaperProductTypes, Sixday } from 'helpers/productPrice/productOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { finalPrice, regularPrice } from 'helpers/productPrice/paperProductPrices';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';


// ---- Helpers ----- //
// TODO: Can we get rid of all these price helpers?
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

const getPlans = (fulfilmentOption: PaperFulfilmentOptions, productPrices: ProductPrices) => {
  const plans = PaperProductTypes.reduce((products, productOption) => {
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
  return plans;
};


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
