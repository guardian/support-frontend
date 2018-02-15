// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import { contributionSelectionReducerFor } from 'components/contributionSelection/contributionSelectionReducer';
import { payPalContributionButtonReducerFor } from 'components/paymentButtons/payPalContributionButton/payPalContributionButtonReducer';

import type { State as ContributionSelectionState } from 'components/contributionSelection/contributionSelectionReducer';
import type { State as PayPalState } from 'components/paymentButtons/payPalContributionButton/payPalContributionButtonReducer';

import type { CommonState } from 'helpers/page/page';


// ----- Types ----- //

type PageState = {
  selection: ContributionSelectionState,
  payPal: PayPalState,
};

export type State = {
  common: CommonState,
  page: PageState,
};


// ----- Reducer ----- //

export default combineReducers({
  selection: contributionSelectionReducerFor('CONTRIBUTE_SECTION'),
  payPal: payPalContributionButtonReducerFor('CONTRIBUTE_SECTION'),
});
