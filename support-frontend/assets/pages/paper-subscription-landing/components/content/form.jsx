// @flow
import { connect } from 'react-redux';

import { type Option } from 'helpers/types/option';
import { getNewsstandPrice, getNewsstandSaving, sendTrackingEventsOnClick } from 'helpers/subscriptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { type Price, showPrice } from 'helpers/productPrice/productPrices';
import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';
import { flashSaleIsActive, getDuration } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { finalPrice, regularPrice } from 'helpers/productPrice/paperProductPrices';
import { paperCheckoutUrl } from 'helpers/routes';
import { getTitle } from '../../helpers/products';

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


const copy = {
  HomeDelivery: 'Have your papers delivered to your home',
  Collection: 'Collect your papers from your local retailer',
};

const getPlans = (
  fulfilmentOption: PaperFulfilmentOptions,
  productPrices: ProductPrices,
) =>
  ActivePaperProductTypes.reduce((products, productOption) => {
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
        offer: getOfferStr(price.price, getNewsstandPrice(productOption)),
        saving: getSavingStr(regularPrice(productPrices, fulfilmentOption, productOption)),
      },
    };
  }, {});


// ----- State/Props Maps ----- //
const mapStateToProps = (state: State): PropTypes<PaperProductOptions> => ({
  plans: state.page.productPrices ? getPlans(state.page.tab, state.page.productPrices) : {},
});

// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
