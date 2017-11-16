// @flow

// ----- Imports ----- //

import { contribCamelCase } from '../contributions';


// ----- Tests ----- //

describe('theGrid', () => {

  it('should correctly return camelCase versions of contributions', () => {

    expect(contribCamelCase('ANNUAL')).toEqual('annual');
    expect(contribCamelCase('MONTHLY')).toEqual('monthly');
    expect(contribCamelCase('ONE_OFF')).toEqual('oneOff');

  });

});
