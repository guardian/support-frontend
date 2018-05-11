// @flow

// ----- Imports ----- //

import { combineReducers, type CombinedReducer } from 'redux';

import { contributionSelectionReducerFor } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import { payPalContributionButtonReducerFor } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonReducer';

import type { State as ContributionSelectionState } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import type { Action as CSA } from 'containerisableComponents/contributionSelection/contributionSelectionActions';
import type { State as PayPalState } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonReducer';
import type { Action as PPA } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonActions';

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


// ----- Functions ----- //

function createPageReducerFor(countryGroupId: CountryGroupId): CombinedReducer<PageState, CSA | PPA> {

  return combineReducers({
    selection: contributionSelectionReducerFor('CONTRIBUTE_SECTION', countryGroupId),
    payPal: payPalContributionButtonReducerFor('CONTRIBUTE_SECTION'),
  });

}


// ----- Reducer ----- //

export { createPageReducerFor };
