// @flow

// ----- Imports ----- //

import { contributionSelectionActionsFor } from '../contributionSelectionActions';


// ----- Tests ----- //

describe('Contributions Selection actions', () => {

  const PREFIX = 'MY_PREFIX';
  const actions = contributionSelectionActionsFor(PREFIX);

  it('should create an action to set the contribution type', () => {

    const expectedOneOff = {
      type: 'SET_CONTRIBUTION_TYPE',
      contributionType: 'ONE_OFF',
      scope: PREFIX,
    };

    const expectedMonthly = {
      type: 'SET_CONTRIBUTION_TYPE',
      contributionType: 'MONTHLY',
      scope: PREFIX,
    };

    const expectedAnnual = {
      type: 'SET_CONTRIBUTION_TYPE',
      contributionType: 'ANNUAL',
      scope: PREFIX,
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
      scope: PREFIX,
    };

    expect(actions.setAmount(amount)).toEqual(expectedAction);

  });

  it('should create an action to set a custom amount', () => {

    const amount = '22';

    const expectedAction = {
      type: 'SET_CUSTOM_AMOUNT',
      amount,
      scope: PREFIX,
    };

    expect(actions.setCustomAmount(amount)).toEqual(expectedAction);

  });

});
