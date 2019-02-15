// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fromCountry } from 'helpers/internationalisation/countryGroup';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { showPrice, type Price, type ProductPrices } from 'helpers/productPrice/productPrices';
import { amountToPay as digitalPackAmountToPay } from 'helpers/productPrice/digitalProductPrices';
import { getDigitalPrice } from 'helpers/subscriptions';
import { getDiscount, getFormattedFlashSalePrice, flashSaleIsActive } from 'helpers/flashSale';
import { priceByCountryGroupId } from 'helpers/internationalisation/price';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, {
  type DispatchPropTypes,
  type StatePropTypes,
} from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../digitalSubscriptionLandingReducer';
import { redirectToDigitalPage, setPlan } from '../digitalSubscriptionLandingActions';


// ---- Plans ----- //

const getPrice = (productPrices: ProductPrices, country: IsoCountry, period: DigitalBillingPeriod) => {
  const countryGroupId = fromCountry(country);

  if (countryGroupId && flashSaleIsActive('DigitalPack', countryGroupId)) {
    const priceAsNumber: number = Number(getFormattedFlashSalePrice('DigitalPack', countryGroupId, period));
    const flashSalePrice: Price = priceByCountryGroupId(countryGroupId, priceAsNumber);
    return showPrice(flashSalePrice);
  }

  return showPrice(digitalPackAmountToPay(productPrices, period, country));
};

const getAnnualSaving = (country: IsoCountry): ?Price => {
  const countryGroupId = fromCountry(country);
  if (countryGroupId) {
    const annualizedMonthlyCost = getDigitalPrice(countryGroupId, Monthly).price * 12;
    const annualCost = getDigitalPrice(countryGroupId, Annual);

    return { ...annualCost, price: (annualizedMonthlyCost - annualCost.price) };
  }
  return null;
};

const getOfferText = (country: IsoCountry, period: DigitalBillingPeriod): ?string => {
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

const getAnnualCopy = (productPrices: ProductPrices, country: IsoCountry) => {
  const countryGroupId = fromCountry(country);
  const saving = getAnnualSaving(country);
  if (countryGroupId && flashSaleIsActive('DigitalPack', countryGroupId)) {
    return `14 day free trial, then ${getPrice(productPrices, country, Annual)} every 12 months`;
  } else if (saving) {
    return `14 day free trial, then ${getPrice(productPrices, country, Annual)} every 12 months (save ${showPrice(saving)} per year)`;
  }
  return `14 day free trial, then ${getPrice(productPrices, country, Annual)} every 12 months`;
};

const getMonthlyCopy = (productPrices: ProductPrices, country: IsoCountry) => `14 day free trial, then ${getPrice(productPrices, country, Monthly)} a month`;

const billingPeriods = {
  [Monthly]: {
    title: 'Monthly',
    offer: (country: IsoCountry) => getOfferText(country, 'Monthly'),
    copy: getMonthlyCopy,
  },
  [Annual]: {
    title: 'Annually',
    offer: (country: IsoCountry) => getOfferText(country, 'Annual'),
    copy: getAnnualCopy,
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
