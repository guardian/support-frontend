// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';

import { billingPeriods, type State } from '../weeklySubscriptionLandingReducer';
import { redirectToWeeklyPage, setPeriod } from '../weeklySubscriptionLandingActions';
import { type Action } from './productPagePeriodFormActions';

import ProductPagePeriodForm from './productPagePeriodForm';


// ---- Types ----- //


// ----- Render ----- //

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
