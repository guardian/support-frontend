// @flow
import { connect } from 'react-redux';

import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import {
  finalPrice,
  getCurrency,
  type ProductPrice,
  type ProductPrices,
  showPrice,
} from 'helpers/productPrice/productPrices';
import {
  flashSaleIsActive,
  getDiscount,
  getFormattedFlashSalePrice,
} from 'helpers/flashSale';
import { type IsoCountry } from 'helpers/internationalisation/country';
import ProductPagePlanForm, { type PropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../digitalSubscriptionLandingReducer';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getDigitalCheckout } from 'helpers/externalLinks';

// ---- Prices ----- //

const getPrice = (productPrices: ProductPrices, period: DigitalBillingPeriod, country: IsoCountry) => {
  const countryGroupId = fromCountry(country);

  if (countryGroupId && flashSaleIsActive('DigitalPack', countryGroupId)) {
    // TODO: this should be using promotions not hard coded prices
    const price: number = Number(getFormattedFlashSalePrice('DigitalPack', countryGroupId, period));
    return {
      price,
      fixedTerm: false,
      currency: getCurrency(country),
    };
  }

  return (finalPrice(productPrices, country, period));
};

const getAnnualSaving = (
  productPrices: ProductPrices,
  country: IsoCountry,
): ?ProductPrice => {
  const annualizedMonthlyCost = getPrice(productPrices, Monthly, country).price * 12;
  const annualCost = getPrice(productPrices, Annual, country);
  const saving = annualizedMonthlyCost - annualCost.price;
  if (saving > 1) {
    return { ...annualCost, price: saving };
  }
  return null;
};

const displayPrice = (
  productPrices: ProductPrices,
  period: DigitalBillingPeriod,
  country: IsoCountry,
): string => showPrice(getPrice(productPrices, period, country));


// ---- Copy ----- //

const getOfferCopy = (country: IsoCountry, period: DigitalBillingPeriod): ?string => {
  const countryGroupId = fromCountry(country);
  if (countryGroupId) {
    const discount = (getDiscount('DigitalPack', countryGroupId));
    if (discount && discount > 0) {
      return `Save ${(discount * 100).toString()}%`;
    }
    if (period === 'Annual') {
      return 'Save 17%';
    }
  }
  return null;
};


// ---- Periods ----- //

const billingPeriods = {
  [Monthly]: {
    title: 'Monthly',
    offer: (country: IsoCountry) => getOfferCopy(country, Monthly),
    copy: (productPrices: ProductPrices, country: IsoCountry) => `14 day free trial, then ${displayPrice(productPrices, Monthly, country)} a month for 12 months`,
  },
  [Annual]: {
    title: 'Annually',
    offer: (country: IsoCountry) => getOfferCopy(country, Annual),
    copy: (productPrices: ProductPrices, country: IsoCountry) => {
      const saving = getAnnualSaving(productPrices, country);
      return [
        `14 day free trial, then ${displayPrice(productPrices, Annual, country)} for the first year`,
        saving ? `(save ${showPrice(saving)} per year)` : null,
      ].join(' ');
    },
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): PropTypes<DigitalBillingPeriod> => {
  const { productPrices } = state.page;
  if (productPrices) {
    return ({
      plans: Object.keys(billingPeriods).reduce((ps, k) => ({
        ...ps,
        [k]: {
          title: billingPeriods[k].title,
          copy: billingPeriods[k].copy(productPrices, state.common.internationalisation.countryId),
          offer: billingPeriods[k].offer(state.common.internationalisation.countryId) || null,
          href: getDigitalCheckout(state.common.internationalisation.countryGroupId, k),
          onClick: sendTrackingEventsOnClick('subscribe_now_cta', 'DigitalPack', null, k),
          price: null,
          saving: null,
        },
      }), {}),
    });
  }
  return { plans: {} };
};

// ----- Exports ----- //

export default connect(mapStateToProps)(ProductPagePlanForm);
