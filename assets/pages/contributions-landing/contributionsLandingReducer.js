// @flow

// ----- Imports ----- //

import { combineReducers, type CombinedReducer } from 'redux';

import { contributionSelectionReducerFor } from 'components/contributionSelection/contributionSelectionReducer';
import { payPalContributionButtonReducerFor } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonReducer';

import type { State as ContributionSelectionState } from 'components/contributionSelection/contributionSelectionReducer';
import type { Action as ContributionSelectionAction } from 'components/contributionSelection/contributionSelectionActions';
import type { State as PayPalState } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonReducer';
import type { Action as PayPalAction } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonActions';

import type { CommonState } from 'helpers/page/page';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

type PageState = {
  selection: ContributionSelectionState,
  payPal: PayPalState,
};

export type State = {
  common: CommonState,
  page: PageState,
};

type PageReducer = CombinedReducer<PageState, ContributionSelectionAction | PayPalAction>;


// ----- Functions ----- //

function createPageReducerFor(countryGroupId: CountryGroupId): PageReducer {

  return combineReducers({
    selection: contributionSelectionReducerFor('CONTRIBUTE_SECTION', countryGroupId),
    payPal: payPalContributionButtonReducerFor('CONTRIBUTE_SECTION'),
  });

}


// ----- Reducer ----- //

export { createPageReducerFor };
