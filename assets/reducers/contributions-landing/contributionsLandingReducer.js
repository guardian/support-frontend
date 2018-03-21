// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import { contributionSelectionReducerFor } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import { payPalContributionButtonReducerFor } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonReducer';

import type { State as ContributionSelectionState } from 'containerisableComponents/contributionSelection/contributionSelectionReducer';
import type { State as PayPalState } from 'containerisableComponents/payPalContributionButton/payPalContributionButtonReducer';

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

function createPageReducerFor(countryGroupId: CountryGroupId): PageState {

  return combineReducers({
    selection: contributionSelectionReducerFor('CONTRIBUTE_SECTION', countryGroupId),
    payPal: payPalContributionButtonReducerFor('CONTRIBUTE_SECTION'),
  });

}


// ----- Reducer ----- //

export { createPageReducerFor };
