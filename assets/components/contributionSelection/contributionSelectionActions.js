// @flow

// ----- Imports ----- //

import type { Contrib as ContributionType } from 'helpers/contributions';


// ----- Types ----- //

export type Action =
  | { type: 'SET_CONTRIBUTION_TYPE', scope: string, contributionType: ContributionType }
  | { type: 'SET_AMOUNT', scope: string, amount: string }
  | { type: 'SET_CUSTOM_AMOUNT', scope: string, amount: string };


// ----- Action Creators ----- //

export default function contributionSelectionActionsFor(scope: string): Object {

  return {
    setContributionType(contributionType: ContributionType): Action {
      return { type: 'SET_CONTRIBUTION_TYPE', scope, contributionType };
    },
    setAmount(amount: string): Action {
      return { type: 'SET_AMOUNT', scope, amount };
    },
    setCustomAmount(amount: string): Action {
      return { type: 'SET_CUSTOM_AMOUNT', scope, amount };
    },
  };

}
