// @flow

// ----- Imports ----- //

import type { Contrib as ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

export type Action =
  | { type: 'SET_CONTRIBUTION_TYPE', scope: string, contributionType: ContributionType, countryGroupId: CountryGroupId }
  | { type: 'SET_AMOUNT', scope: string, amount: string }
  | { type: 'SET_CUSTOM_AMOUNT', scope: string, amount: string, countryGroupId: CountryGroupId };


// ----- Action Creators ----- //

function contributionSelectionActionsFor(scope: string): Object {

  return {
    setContributionType(
      contributionType: ContributionType,
      countryGroupId: CountryGroupId,
    ): Action {
      return {
        type: 'SET_CONTRIBUTION_TYPE', scope, contributionType, countryGroupId,
      };
    },
    setAmount(amount: string): Action {
      return { type: 'SET_AMOUNT', scope, amount };
    },
    setCustomAmount(amount: string, countryGroupId: CountryGroupId): Action {
      return {
        type: 'SET_CUSTOM_AMOUNT', scope, amount, countryGroupId,
      };
    },
  };

}


// ----- Exports ----- //

export { contributionSelectionActionsFor };
