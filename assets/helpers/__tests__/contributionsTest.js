// @flow

// ----- Imports ----- //

import { getContribKey } from '../contributions';


// ----- Tests ----- //

describe('theGrid', () => {

  it('should correctly return camelCase versions of contributions', () => {

    expect(getContribKey('ANNUAL')).toEqual('annual');
    expect(getContribKey('MONTHLY')).toEqual('monthly');
    expect(getContribKey('ONE_OFF')).toEqual('oneOff');

  });

});
