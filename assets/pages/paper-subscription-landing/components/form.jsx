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
  collectionEveryday: {
    title: 'Everyday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  collectionSixday: {
    title: 'Sixday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  collectionWeekend: {
    title: 'Weekend',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  collectionSunday: {
    title: 'Collect Sunday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  deliveryEveryday: {
    title: 'Everyday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  deliverySixday: {
    title: 'Sixday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  deliveryWeekend: {
    title: 'Weekend',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
  deliverySunday: {
    title: 'Delivery Sunday',
    offer: null,
    copy: 'Lorem ipsum sit amet',
  },
};


// ----- State/Props Maps ----- //
const mapStateToProps = (state: State): StatePropTypes<PaperBillingPlan> => ({
  plans: Object
    .entries(plans)
    .filter(([key]) => key.toLowerCase().includes(state.page.tabs.active))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  selectedPlan: state.page.plan.plan,
});

const mapDispatchToProps = (dispatch: Dispatch<Action<PaperBillingPlan>>): DispatchPropTypes<PaperBillingPlan> =>
  ({
    setPlanAction: bindActionCreators(setPlan, dispatch),
    onSubmitAction: bindActionCreators(() => null, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePlanForm);
