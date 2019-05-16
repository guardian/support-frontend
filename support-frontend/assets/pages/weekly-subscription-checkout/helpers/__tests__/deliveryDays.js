// @flow

// ----- Imports ----- //

import { getWeeklyDays } from '../deliveryDays';
import { formatMachineDate, formatUserDate } from 'helpers/dateConversions';


// ----- Tests ----- //
const tuesday = 1551175752198; /* 2019-02-26 */
const friday = 1551399618000; /* 2019-01-01 */
const thursday = 1551918018000; /* 2019-03-07 */

describe('deliveryDays', () => {

  describe('date formatters', () => {

    it('formatMachineDate formats date in YYYY-DD-MM format', () => {
      expect(formatMachineDate(new Date(friday))).toEqual('2019-03-01');
    });
    it('formatUserDate formats date in a readable format', () => {
      expect(formatUserDate(new Date(friday))).toEqual('Friday, March 1, 2019');
    });
  });

  describe('getWeeklyDays', () => {
    it('if you order after wednesday, it delivers the Weekly on Friday fortnight', () => {
      const days = getWeeklyDays(thursday);
      expect(formatMachineDate(days[0])).toEqual('2019-03-22');
    });
    it('if you order before wednesday midnight, it delivers the Weekly on Friday week', () => {
      const days = getWeeklyDays(tuesday);
      expect(formatMachineDate(days[0])).toEqual('2019-03-08');
    });
  });


});
