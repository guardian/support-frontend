// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type PaperBillingPeriod } from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePeriodForm/productPagePeriodFormActions';
import ProductPagePeriodForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePeriodForm/productPagePeriodForm';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setPeriod } from '../paperSubscriptionLandingPageActions';


// ---- Periods ----- //

const billingPeriods = {
  month: {
    title: 'Everyday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  sixday: {
    title: 'Sixday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  weekend: {
    title: 'Weekend',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  sunday: {
    title: 'Sunday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<PaperBillingPeriod> => ({
  periods: billingPeriods,
  selectedPeriod: state.page.period,
});

const mapDispatchToProps = (dispatch: Dispatch<Action<PaperBillingPeriod>>): DispatchPropTypes<PaperBillingPeriod> =>
  ({
    setPeriodAction: bindActionCreators(setPeriod, dispatch),
    onSubmitAction: bindActionCreators(() => null, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePeriodForm);
