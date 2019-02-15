// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { showPrice, getCurrency, type Price, type ProductPrices } from 'helpers/productPrice/productPrices';
import { finalPrice as dpFinalPrice } from 'helpers/productPrice/digitalProductPrices';
import { getDiscount, getFormattedFlashSalePrice, flashSaleIsActive } from 'helpers/flashSale';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, {
  type DispatchPropTypes,
  type StatePropTypes,
} from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../digitalSubscriptionLandingReducer';
import { redirectToDigitalPage, setPlan } from '../digitalSubscriptionLandingActions';


// ---- Prices ----- //

const getPrice = (productPrices: ProductPrices, period: DigitalBillingPeriod, country: IsoCountry) => {
  const countryGroupId = fromCountry(country);

  if (countryGroupId && flashSaleIsActive('DigitalPack', countryGroupId)) {
    const price: number = Number(getFormattedFlashSalePrice('DigitalPack', countryGroupId, period));
    return {
      price,
      currency: getCurrency(country),
    };
  }

  return (dpFinalPrice(productPrices, period, country));
};

const getAnnualSaving = (
  productPrices: ProductPrices,
  country: IsoCountry,
): ?Price => {
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
    copy: (productPrices: ProductPrices, country: IsoCountry) => `14 day free trial, then ${displayPrice(productPrices, Monthly, country)} a month`,
  },
  [Annual]: {
    title: 'Annually',
    offer: (country: IsoCountry) => getOfferCopy(country, Annual),
    copy: (productPrices: ProductPrices, country: IsoCountry) => {
      const saving = getAnnualSaving(productPrices, country);
      return [
        `14 day free trial, then ${displayPrice(productPrices, Annual, country)} every 12 months`,
        saving ? `(save ${showPrice(saving)} per year)` : null,
      ].join(' ');
    },
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<DigitalBillingPeriod> => ({
  plans: Object.keys(billingPeriods).reduce((ps, k) => ({
    ...ps,
    [k]: {
      title: billingPeriods[k].title,
      copy: billingPeriods[k].copy(state.page.productPrices, state.common.internationalisation.countryId),
      offer: billingPeriods[k].offer(state.common.internationalisation.countryId) || null,
      price: null,
      saving: null,
    },
  }), {}),
  selectedPlan: state.page.plan.plan,
});

const mapDispatchToProps =
(dispatch: Dispatch<Action<DigitalBillingPeriod>>): DispatchPropTypes<DigitalBillingPeriod> =>
  ({
    setPlanAction: bindActionCreators(setPlan, dispatch),
    onSubmitAction: bindActionCreators(redirectToDigitalPage, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePlanForm);
