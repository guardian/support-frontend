// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { getDigitalPrice } from 'helpers/subscriptions';
import { getDiscount, getFormattedFlashSalePrice, flashSaleIsActive } from 'helpers/flashSale';
import { showPrice, priceByCountryGroupId, USD, type Price } from 'helpers/internationalisation/price';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, {
  type DispatchPropTypes,
  type StatePropTypes,
} from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../digitalSubscriptionLandingReducer';
import { redirectToDigitalPage, setPlan } from '../digitalSubscriptionLandingActions';
import type {SubscriptionProduct} from "../../../helpers/subscriptions";


// ---- Plans ----- //

const getPrice = (countryGroupId: CountryGroupId, period: DigitalBillingPeriod) => {
  if(flashSaleIsActive('DigitalPack', countryGroupId)) {
    const priceAsNumber: number = Number(getFormattedFlashSalePrice('DigitalPack', countryGroupId, period));
    const flashSalePrice: Price = priceByCountryGroupId(countryGroupId, priceAsNumber);
    return showPrice(flashSalePrice);
  }
  return showPrice(getDigitalPrice(countryGroupId, period));
};

const getAnnualSaving = (countryGroupId: CountryGroupId): Price => {
  const annualizedMonthlyCost = getDigitalPrice(countryGroupId, Monthly).value * 12;
  const annualCost = getDigitalPrice(countryGroupId, Annual);

  return { ...annualCost, value: (annualizedMonthlyCost - annualCost.value) };
};

const getOfferText = (countryGroupId: CountryGroupId, period: DigitalBillingPeriod): ?string => {
  const discount = (getDiscount('DigitalPack', countryGroupId)) * 100;
  if (discount > 0) {
    return `Save ${discount.toString()}%`
  } else {
    if(period === 'Annual') {
      return 'Save 17%';
    } else return null;
  }
};

const getAnnualCopy = (countryGroupId: CountryGroupId) => {
  if(flashSaleIsActive('DigitalPack', countryGroupId)){
    return `14 day free trial, then ${getPrice(countryGroupId, Annual)} every 12 months`
  }

  return `14 day free trial, then ${getPrice(countryGroupId, Annual)} every 12 months (save ${showPrice(getAnnualSaving(countryGroupId))} per year)`
};

export const billingPeriods = {
  [Monthly]: {
    title: 'Monthly',
    offer: (countryGroupId: CountryGroupId) => getOfferText(countryGroupId, 'Monthly'),
    copy: (countryGroupId: CountryGroupId) => `14 day free trial, then ${getPrice(countryGroupId, Monthly)} a month`,
  },
  [Annual]: {
    title: 'Annually',
    offer: (countryGroupId: CountryGroupId) => getOfferText(countryGroupId, 'Annual'),
    copy: (countryGroupId: CountryGroupId) => getAnnualCopy(countryGroupId),
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<DigitalBillingPeriod> => ({
  plans: Object.keys(billingPeriods).reduce((ps, k) => ({
    ...ps,
    [k]: {
      title: billingPeriods[k].title,
      copy: billingPeriods[k].copy(state.common.internationalisation.countryGroupId),
      offer: billingPeriods[k].offer(state.common.internationalisation.countryGroupId) || null,
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
