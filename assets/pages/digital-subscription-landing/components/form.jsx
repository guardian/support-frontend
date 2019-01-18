// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { DigitalBillingPeriod } from 'helpers/billingPeriods';
import { Annual, Monthly } from 'helpers/billingPeriods';
import { getDigitalPrice } from 'helpers/subscriptions';
import { showPrice, type Price } from 'helpers/internationalisation/price';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, {
  type DispatchPropTypes,
  type StatePropTypes,
} from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../digitalSubscriptionLandingReducer';
import { redirectToDigitalPage, setPlan } from '../digitalSubscriptionLandingActions';


// ---- Plans ----- //

const getPrice = (countryGroupId: CountryGroupId, period: DigitalBillingPeriod) =>
  showPrice(getDigitalPrice(countryGroupId, period));

const getAnnualSaving = (countryGroupId: CountryGroupId): Price => {
  const annualizedMonthlyCost = getDigitalPrice(countryGroupId, Monthly).value * 12;
  const annualCost = getDigitalPrice(countryGroupId, Annual);

  return { ...annualCost, value: Math.ceil(annualizedMonthlyCost - annualCost.value) };
};

export const billingPeriods = {
  [Monthly]: {
    title: 'Monthly',
    copy: (countryGroupId: CountryGroupId) => `14 day free trial, then ${getPrice(countryGroupId, Monthly)} a month`,
  },
  [Annual]: {
    title: 'Annually',
    offer: 'Now save 20%',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, Annual)} every 12 months (save ${showPrice(getAnnualSaving(countryGroupId))} per year)`,
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<DigitalBillingPeriod> => ({
  plans: Object.keys(billingPeriods).reduce((ps, k) => ({
    ...ps,
    [k]: {
      title: billingPeriods[k].title,
      copy: billingPeriods[k].copy(state.common.internationalisation.countryGroupId),
      offer: billingPeriods[k].offer || null,
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
