// @flow

// ----- Imports ----- //

import type { Country } from 'helpers/internationalisation/country';

import { createCommonReducer } from '../page';


// ----- Tests ----- //

jest.mock('ophan', () => {});

describe('reducer tests', () => {

  let reducer = () => {};

  beforeEach(() => {

    const initialState = {
      intCmp: null,
      campaign: 'dummy_campaign',
      refpvid: null,
      country: 'GB',
      abParticipations: {},
    };

    reducer = createCommonReducer(initialState);

  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle SET_INTCMP to "dummy_intcmp"', () => {

    const intCmp = 'dummy_intcmp';
    const action = {
      type: 'SET_INTCMP',
      intCmp,
    };

    const newState = reducer(undefined, action);

    expect(newState.intCmp).toEqual(intCmp);
    expect(newState.campaign).toBeNull();
    expect(newState.refpvid).toMatchSnapshot();
    expect(newState.country).toMatchSnapshot();
    expect(newState.abParticipations).toMatchSnapshot();
  });

  it('should handle SET_COUNTRY to US', () => {

    const country: Country = 'US';
    const action = {
      type: 'SET_COUNTRY',
      country,
    };

    const newState = reducer(undefined, action);

    expect(newState.country).toEqual(country);
    expect(newState.intCmp).toMatchSnapshot();
    expect(newState.campaign).toMatchSnapshot();
    expect(newState.refpvid).toMatchSnapshot();
    expect(newState.abParticipations).toMatchSnapshot();
  });

});
