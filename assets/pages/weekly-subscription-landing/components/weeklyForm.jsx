// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { currencies, detect } from 'helpers/internationalisation/currency';
import { type WeeklyBillingPeriod, getWeeklyProductPrice } from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePeriodForm/productPagePeriodFormActions';
import ProductPagePeriodForm from 'components/productPage/productPagePeriodForm/productPagePeriodForm';

import { type State } from '../weeklySubscriptionLandingReducer';
import { redirectToWeeklyPage, setPeriod } from '../weeklySubscriptionLandingActions';


// ---- Periods ----- //

const getPrice = (countryGroupId: CountryGroupId, period: WeeklyBillingPeriod) => [
  currencies[detect(countryGroupId)].extendedGlyph,
  getWeeklyProductPrice(countryGroupId, period),
].join('');

export const billingPeriods: {[WeeklyBillingPeriod]: {
  title: string,
  offer?: string,
  copy: (CountryGroupId)=>string
}} = {
  sixweek: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'sixweek')} for the first 6 issues (then ${getPrice(countryGroupId, 'quarter')} quarterly)`,
  },
  quarter: {
    title: 'Quarterly',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'quarter')} every 3 months`,
  },
  year: {
    title: 'Annually',
    copy: (countryGroupId: CountryGroupId) => `${getPrice(countryGroupId, 'year')} every 12 months`,
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State) => {
  const periods = {};
  Object.keys(billingPeriods).forEach((k) => {
    periods[k] = {
      title: billingPeriods[k].title,
      copy: billingPeriods[k].copy(state.common.internationalisation.countryGroupId),
      offer: billingPeriods[k].offer || null,
    };
  });

  return {
    periods,
    selectedPeriod: state.page.period,
    countryGroupId: state.common.internationalisation.countryGroupId,
  };

};

const mapDispatchToProps = (dispatch: Dispatch<Action<WeeklyBillingPeriod>>) => ({
  setPeriodAction: bindActionCreators(setPeriod, dispatch),
  onSubmit: bindActionCreators(redirectToWeeklyPage, dispatch),
});


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePeriodForm);
