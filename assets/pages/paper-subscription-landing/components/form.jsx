// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { currencies } from 'helpers/internationalisation/currency';
import { type PaperBillingPeriod, getPaperProductPrice } from 'helpers/subscriptions';
import { type Action } from 'components/productPage/productPagePeriodForm/productPagePeriodFormActions';
import ProductPagePeriodForm, { type StatePropTypes, type DispatchPropTypes } from 'components/productPage/productPagePeriodForm/productPagePeriodForm';

import { type State } from '../paperSubscriptionLandingPageReducer';
import { redirectToWeeklyPage, setPeriod } from '../paperSubscriptionLandingPageActions';


// ---- Periods ----- //

const getPrice = (period: PaperBillingPeriod) => [
  currencies.GBP.extendedGlyph,
  getPaperProductPrice(period),
].join('');

const billingPeriods = {
  month: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: `${getPrice('sixday')} for the first 6 issues (then ${getPrice('month')} quarterly)`,
  },
  sixday: {
    title: '6 for 6',
    offer: 'Introductory offer',
    copy: `${getPrice('sixday')} for the first 6 issues (then ${getPrice('month')} quarterly)`,
  },
  weekend: {
    title: 'Quarterly',
    offer: null,
    copy: `${getPrice('month')} every 3 months`,
  },
  sunday: {
    title: 'Observer',
    offer: null,
    copy: `${getPrice('month')} every 12 months`,
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
    onSubmitAction: bindActionCreators(redirectToWeeklyPage, dispatch),
  });


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(ProductPagePeriodForm);
