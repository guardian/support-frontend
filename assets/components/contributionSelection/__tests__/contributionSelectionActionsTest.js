// @flow

// ----- Imports ----- //

import { contributionSelectionActionsFor } from '../contributionSelectionActions';


// ----- Tests ----- //

describe('Contributions Selection actions', () => {

  const scope = 'MY_SCOPE';
  const actions = contributionSelectionActionsFor(scope);

  it('should create an action to set the contribution type', () => {

    const expectedOneOff = {
      type: 'SET_CONTRIBUTION_TYPE',
      contributionType: 'ONE_OFF',
      scope,
    };

    const expectedMonthly = {
      type: 'SET_CONTRIBUTION_TYPE',
      contributionType: 'MONTHLY',
      scope,
    };

    const expectedAnnual = {
      type: 'SET_CONTRIBUTION_TYPE',
      contributionType: 'ANNUAL',
      scope,
    };

    expect(actions.setContributionType('ONE_OFF')).toEqual(expectedOneOff);
    expect(actions.setContributionType('MONTHLY')).toEqual(expectedMonthly);
    expect(actions.setContributionType('ANNUAL')).toEqual(expectedAnnual);

  });

  it('should create an action to set the amount', () => {

    const amount = '22';

    const expectedAction = {
      type: 'SET_AMOUNT',
      amount,
      scope,
    };

    expect(actions.setAmount(amount)).toEqual(expectedAction);

  });

  it('should create an action to set a custom amount', () => {

    const amount = '22';

    const expectedAction = {
      type: 'SET_CUSTOM_AMOUNT',
      amount,
      scope,
    };

    expect(actions.setCustomAmount(amount)).toEqual(expectedAction);

  });

});
