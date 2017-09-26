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
      campaign: 'dummy_campaign',
      acquisition: {
        referrerPageViewId: null,
        campaignCode: null,
        referrerUrl: null,
        componentId: null,
        componentTypeV2: null,
        source: null,
        abTests: [],
      },
      country: 'GB',
      abParticipations: {},
    };

    reducer = createCommonReducer(initialState);

  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toMatchSnapshot();
  });

  it('should handle SET_COUNTRY to US', () => {

    const country: Country = 'US';
    const action = {
      type: 'SET_COUNTRY',
      country,
    };

    const newState = reducer(undefined, action);

    expect(newState.country).toEqual(country);
    expect(newState.acquisition.campaignCode).toMatchSnapshot();
    expect(newState.campaign).toMatchSnapshot();
    expect(newState.acquisition.campaignCode).toMatchSnapshot();
    expect(newState.abParticipations).toMatchSnapshot();
  });

});
