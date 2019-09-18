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
import { flashSaleIsActive, getDuration, getPromoCode } from 'helpers/flashSale';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { PaperProductOptions } from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { paperCheckoutUrl } from 'helpers/routes';
import { getTitle } from '../../helpers/products';
import type { ProductPrice, ProductPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';

// ---- Helpers ----- //


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

const getOfferStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> => {
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
  HomeDelivery: {
    Everyday: 'Guardian and Observer papers, delivered',
    Sixday: 'Guardian papers, delivered',
    Weekend: 'Saturday Guardian and Observer papers, delivered',
    Sunday: 'Observer paper, delivered',
  },

  Collection: {
    Everyday: 'Guardian and Observer papers',
    Sixday: 'Guardian papers',
    Weekend: 'Saturday Guardian and Observer papers',
    Sunday: 'Observer paper',
  },
};

const getPlans = (
  fulfilmentOption: PaperFulfilmentOptions,
  productPrices: ProductPrices,
) =>
  ActivePaperProductTypes.reduce((products, productOption) => {
    const price = finalPrice(productPrices, fulfilmentOption, productOption);
    const promoCode = getPromoCode('Paper', GBPCountries, '');
    return {
      ...products,
      [productOption]: {
        href: paperCheckoutUrl(fulfilmentOption, productOption, promoCode),
        onClick: sendTrackingEventsOnClick(
          'subscribe_now_cta',
          'Paper',
          null,
          [productOption, fulfilmentOption].join(),
        ),
        title: getTitle(productOption),
        copy: copy[fulfilmentOption][productOption],
        price: getPriceStr(price),
        offer: getOfferStr(price.price, getNewsstandPrice(productOption)),
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
