// @flow

// ----- Imports ----- //

import {getVariantsAsString, init as abInit } from '../abtest';
import type {Participations}  from '../abtest';

jest.mock('ophan', () => {});



// ----- Tests ----- //


describe('abTest init function', () => {

  it('should return user in test', () => {

    document.cookie = "GU_mvt_id=12345";
    console.log(global);
    console.log("------------");
    global.tests = [
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

    console.log(global.tests);
    const country = 'GB';

    const participations: Participations = abInit(country);
    const expectedParticipations: Participations = {};

    expect(participations).toEqual(expectedParticipations);

  });

});
