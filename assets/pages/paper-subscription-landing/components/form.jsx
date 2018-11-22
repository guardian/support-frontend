// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type PaperBillingPlan } from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePlanForm/productPagePlanFormActions';
import ProductPagePlanForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePlanForm/productPagePlanForm';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { setPlan } from '../paperSubscriptionLandingPageActions';


// ---- Plans ----- //

const plans = {
  everyday: {
    title: 'Everyday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
    price: '£56.12 per month',
    saving: 'save £3.45 a month',
  },
  sixday: {
    title: 'Sixday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
    price: '£56.12 per month',
    saving: 'save £3.45 a month',
  },
  weekend: {
    title: 'Weekend',
    offer: null,
    copy: 'Lorem ipsum sit amet',
    price: '£56.12 per month',
    saving: 'save £3.45 a month',
  },
  sunday: {
    title: 'Sunday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
    price: '£56.12 per month',
    saving: 'save £3.45 a month',
  },
};


// ----- State/Props Maps ----- //

const mapStateToProps = (state: State): StatePropTypes<PaperBillingPlan> => ({
  plans,
  selectedPlan: state.page.plan,
});

const mapDispatchToProps = (dispatch: Dispatch<Action<PaperBillingPlan>>): DispatchPropTypes<PaperBillingPlan> =>
  ({
    setPlanAction: bindActionCreators(setPlan, dispatch),
    onSubmitAction: bindActionCreators(() => null, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePlanForm);
