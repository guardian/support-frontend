// @flow

import { type Store } from 'redux';
import { contributionSelectionActionsFor } from 'components/contributionSelection/contributionSelectionActions';

export function setInitialAmountsForAnnualHigherAmountsVariant(store: Store<*, *, *>) {
  const annualTestVariant = store.getState().common.abParticipations.annualContributionsRoundTwo;
  if (annualTestVariant === 'annualHigherAmounts') {
    store.dispatch(contributionSelectionActionsFor('CONTRIBUTE_SECTION').setAmountForContributionType('ANNUAL', 100));
  }
}
