// @flow
import { connect } from 'react-redux';

import { type Option } from 'helpers/types/option';
import {
  getNewsstandPrice,
  getNewsstandSaving,
  getNewsstandSavingPercentage,
  sendTrackingEventsOnClick,
} from 'helpers/subscriptions';
import {
  finalPrice,
  getProductPrice,
} from 'helpers/productPrice/paperProductPrices';
import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../../paperSubscriptionLandingPageReducer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type {
  PaperProductOptions,
} from 'helpers/productPrice/productOptions';
import { ActivePaperProductTypes } from 'helpers/productPrice/productOptions';
import { paperCheckoutUrl } from 'helpers/routes';
import { getTitle } from '../../helpers/products';
import type { ProductPrice, ProductPrices } from 'helpers/productPrice/productPrices';
import { showPrice } from 'helpers/productPrice/productPrices';
import { getAppliedPromo } from 'helpers/productPrice/promotions';
import { flashSaleIsActive } from 'helpers/flashSale';
import { Paper } from 'helpers/subscriptions';

// ---- Helpers ----- //

const getRegularPriceStr = (price: ProductPrice): string => `You pay ${showPrice(price)} a month`;

const getPriceStr = (price: ProductPrice): string => {
  const promotion = getAppliedPromo(price.promotions);
  if (promotion && promotion.numberOfDiscountedPeriods) {
    // $FlowIgnore - we have checked numberOfDiscountedPeriods is not null above
    return `You pay ${showPrice(price)} a month for ${promotion.numberOfDiscountedPeriods} months`;
  }
  return getRegularPriceStr(price);
};

const getOfferStr = (subscription: Option<number>, newsstand: Option<number>): Option<string> => {
  if ((subscription && newsstand && parseFloat(getNewsstandSaving(subscription, newsstand)) > 0)) {
    return `Save ${getNewsstandSavingPercentage(subscription, newsstand)}% a month on retail price`;
  }
  return null;
};

const getSavingStr = (price: ProductPrice): Option<string> => {
  const promotionApplied = getAppliedPromo(price.promotions);
  if (promotionApplied) {
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

const getOfferText = (price: ProductPrice, productOption: PaperProductOptions) => {
  if (flashSaleIsActive(Paper)) {
    return getOfferStr(price.price, getNewsstandPrice(productOption));
  }
  if (price.saving && price.saving > 0) { return `Save ${price.saving}% on retail price`; }

  return null;
};

const getPlans = (
  fulfilmentOption: PaperFulfilmentOptions,
  productPrices: ProductPrices,
) =>
  ActivePaperProductTypes.reduce((products, productOption) => {
    const price = finalPrice(productPrices, fulfilmentOption, productOption);
    const promotion = getAppliedPromo(price.promotions);
    const promoCode = promotion ? promotion.promoCode : null;
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
        price: flashSaleIsActive(Paper) ? getPriceStr(price) : getRegularPriceStr(price),
        offer: getOfferText(price, productOption),
        saving: flashSaleIsActive(Paper)
          ? getSavingStr(getProductPrice(productPrices, fulfilmentOption, productOption))
          : null,
      },
    };
  }, {});


// ----- State/Props Maps ----- //
const mapStateToProps = (state: State): PropTypes<PaperProductOptions> => ({
  plans: state.page.productPrices ? getPlans(state.page.tab, state.page.productPrices) : {},
});

// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
