// @flow
import { connect } from 'react-redux';

import { type Option } from 'helpers/types/option';
import {
  getNewsstandPrice,
  getNewsstandSaving,
  sendTrackingEventsOnClick,
} from 'helpers/subscriptions';
import {
  finalPrice,
  getProductPrice,
} from 'helpers/productPrice/paperProductPrices';
import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';
import { flashSaleIsActive, getDuration } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { paperCheckoutUrl } from 'helpers/routes';
import { getTitle } from '../../helpers/products';
import { getDiscountCopy } from '../hero/discountCopy';
import { getQueryParameter } from 'helpers/url';
import type { ProductPrice, ProductPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';

// ---- Helpers ----- //


const discountParam: ?string = getQueryParameter('heroCopy');

// TODO: We will need to make this work for flash sales
const getRegularPriceStr = (price: ProductPrice): string => `You pay ${showPrice(price)} a month`;

const getPriceStr = (price: ProductPrice): string => {
  if (flashSaleIsActive('Paper', GBPCountries)) {
    const duration = getDuration('Paper', GBPCountries);
    if (duration) {
      return `You pay ${showPrice(price)} a month for ${duration}`;
    }
    return getRegularPriceStr(price);
  }
  return getRegularPriceStr(price);
};

const getOfferStr = (subscription: Option<number>, newsstand: Option<number>, index: number): Option<string> => {

  if (discountParam !== 'save') {
    // This is the function call that returns the discount copy from the A/B test
    return getDiscountCopy(discountParam).offer[index];
  }

  if ((subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0)) {
    return `Save £${getNewsstandSaving(subscription, newsstand)} a month on retail price`;
  }

  return null;
};

const getSavingStr = (price: ProductPrice): Option<string> => {
  if (flashSaleIsActive('Paper', GBPCountries) && getDuration('Paper', GBPCountries)) {
    return `${showPrice(price)} a month thereafter`;
  }
  return null;
};


// ---- Plans ----- //


const copy = {
  HomeDelivery: 'Have your papers delivered to your home',
  Collection: 'Collect your papers from your local retailer',
};

const getPlans = (
  fulfilmentOption: PaperFulfilmentOptions,
  productPrices: ProductPrices,
) =>
  ActivePaperProductTypes.reduce((products, productOption, index) => {
    const price = finalPrice(productPrices, fulfilmentOption, productOption);
    return {
      ...products,
      [productOption]: {
        href: paperCheckoutUrl(fulfilmentOption, productOption),
        onClick: sendTrackingEventsOnClick(
          'subscribe_now_cta',
          'Paper',
          null,
          [productOption, fulfilmentOption].join(),
        ),
        title: getTitle(productOption),
        copy: copy[fulfilmentOption],
        price: getPriceStr(price),
        offer: getOfferStr(price.price, getNewsstandPrice(productOption), index),
        saving: getSavingStr(getProductPrice(productPrices, fulfilmentOption, productOption)),
      },
    };
  }, {});


// ----- State/Props Maps ----- //
const mapStateToProps = (state: State): PropTypes<PaperProductOptions> => ({
  plans: state.page.productPrices ? getPlans(state.page.tab, state.page.productPrices) : {},
});

// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
