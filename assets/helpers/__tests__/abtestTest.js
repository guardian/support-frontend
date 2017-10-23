// @flow

// ----- Imports ----- //

import { getVariantsAsString, init as abInit } from '../abtest';
import type { Participations } from '../abtest';

jest.mock('ophan', () => {});


// ----- Tests ----- //


describe('basic behaviour of init', () => {

  it('The user should be allocated in the control bucket', () => {

    document.cookie = 'GU_mvt_id=12346';

    const tests = [
      {
        testId: 'mockTest',
        variants: ['control', 'variant'],
        audiences: {
          GB: {
            offset: 0,
            size: 1,
          },
        },
        isActive: true,
      }];

    const country = 'GB';
    const participations: Participations = abInit(country, tests);
    const expectedParticipations: Participations = { mockTest: 'control' };

    expect(participations).toEqual(expectedParticipations);
  });

  it('The user should be allocated in the variant bucket', () => {

    document.cookie = 'GU_mvt_id=12345';

    const tests = [
      {
        testId: 'mockTest',
        variants: ['control', 'variant'],
        audiences: {
          GB: {
            offset: 0,
            size: 1,
          },
        },
        isActive: true,
      }];

    const country = 'GB';
    const participations: Participations = abInit(country, tests);
    const expectedParticipations: Participations = { mockTest: 'variant' };

    expect(participations).toEqual(expectedParticipations);
  });

  it('The user should be allocated in the variant bucket', () => {

    document.cookie = 'GU_mvt_id=12346';

    const tests = [
      {
        testId: 'mockTest',
        independence: 1,
        variants: ['control', 'variant'],
        audiences: {
          GB: {
            offset: 0,
            size: 1,
          },
        },
        isActive: true,
      }];

    const country = 'GB';
    const participations: Participations = abInit(country, tests);
    const expectedParticipations: Participations = { mockTest: 'variant' };

    expect(participations).toEqual(expectedParticipations);
  });

  it('The user should not be allocated in a test for a different country', () => {

    document.cookie = 'GU_mvt_id=12346';

    const tests = [
      {
        testId: 'mockTest',
        variants: ['control', 'variant'],
        audiences: {
          GB: {
            offset: 0,
            size: 1,
          },
        },
        isActive: true,
      }];

    const country = 'US';
    const participations: Participations = abInit(country, tests);
    const expectedParticipations: Participations = { mockTest: 'notintest' };

    expect(participations).toEqual(expectedParticipations);
  });
});

describe('Correct allocation in a multi test environment', () => {
  /*
  GB: |                    100%                      |
                           Test1

  US: |  20%   |        60%                |   20%   |
        Test 1         Test 2              Not in Test
   */

  const tests = [
    {
      testId: 'mockTest',
      variants: ['control', 'variant'],
      audiences: {
        GB: {
          offset: 0,
          size: 1,
        },
        US: {
          offset: 0,
          size: 0.2,
        },
      },
      isActive: true,
    },
    {
      testId: 'mockTest2',
      variants: ['control', 'variant'],
      audiences: {
        US: {
          offset: 0.2,
          size: 0.6,
        },
      },
      isActive: true,
    },
  ];

  it('It correctly segments a user who has a cookie in the top 80% in GB', () => {

    document.cookie = 'GU_mvt_id=810000';
    const country = 'GB';

    const participations: Participations = abInit(country, tests);
    const expectedParticipations: Participations = { mockTest: 'control', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);
  });

  it('It correctly segments a user who has a cookie above 80% in US', () => {

    document.cookie = 'GU_mvt_id=810000';
    const country = 'US';

    const participations: Participations = abInit(country, tests);
    const expectedParticipations: Participations = { mockTest: 'notintest', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);
  });

  it('It correctly segments a user who has a cookie between 20% and 80% in GB', () => {

    document.cookie = 'GU_mvt_id=510000';
    const country = 'GB';

    let participations: Participations = abInit(country, tests);
    let expectedParticipations: Participations = { mockTest: 'control', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);

    document.cookie = 'GU_mvt_id=510001';
    participations = abInit(country, tests);
    expectedParticipations = { mockTest: 'variant', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);
  });

  it('It correctly segments a user who has a cookie between 20% and 80% in US', () => {

    document.cookie = 'GU_mvt_id=510000';
    const country = 'US';

    let participations: Participations = abInit(country, tests);
    let expectedParticipations: Participations = { mockTest: 'notintest', mockTest2: 'control' };
    expect(participations).toEqual(expectedParticipations);

    document.cookie = 'GU_mvt_id=510001';
    participations = abInit(country, tests);
    expectedParticipations = { mockTest: 'notintest', mockTest2: 'variant' };
    expect(participations).toEqual(expectedParticipations);
    expect(getVariantsAsString(participations)).toEqual('mockTest=notintest; mockTest2=variant');
  });

  it('It correctly segments a user who has a cookie between 0 and 20% in GB', () => {

    document.cookie = 'GU_mvt_id=150000';
    const country = 'GB';

    let participations: Participations = abInit(country, tests);
    let expectedParticipations: Participations = { mockTest: 'control', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);

    document.cookie = 'GU_mvt_id=150001';
    participations = abInit(country, tests);
    expectedParticipations = { mockTest: 'variant', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);
  });

  it('It correctly segments the user a user who has a cookie between 0 and 20% in US', () => {

    document.cookie = 'GU_mvt_id=150000';
    const country = 'US';

    let participations: Participations = abInit(country, tests);
    let expectedParticipations: Participations = { mockTest: 'control', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);

    document.cookie = 'GU_mvt_id=150001';
    participations = abInit(country, tests);
    expectedParticipations = { mockTest: 'variant', mockTest2: 'notintest' };
    expect(participations).toEqual(expectedParticipations);
  });

});
