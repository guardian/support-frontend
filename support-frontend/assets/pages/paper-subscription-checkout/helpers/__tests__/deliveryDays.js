// @flow

// ----- Imports ----- //

import {
  getVoucherDays, getDeliveryDays, formatMachineDate, formatUserDate,
} from '../deliveryDays';


// ----- Tests ----- //
const tuesday = 1551175752198; /* 2019-02-26 */
const wednesday = 1551275752198; /* 2019-02-27 */
const sunday = 1551577952198; /* 2019-03-03 */

describe('deliveryDays', () => {

  describe('date formatters', () => {

    it('formatMachineDate formats date in YYYY-DD-MM format', () => {
      expect(formatMachineDate(new Date(wednesday))).toEqual('2019-02-27');
    });
    it('formatUserDate formats date in a readable format', () => {
      expect(formatUserDate(new Date(wednesday))).toEqual('Wednesday, February 27, 2019');
    });
  });

  describe('getDeliveryDays', () => {
    it('delivers the Sunday paper on the next Sunday', () => {
      const days = getDeliveryDays(wednesday, 'Sunday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-03');
    });
    it('delivers the Monday paper on the next Monday even if it\'s a Sunday', () => {
      const days = getDeliveryDays(sunday, 'Everyday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-04');
    });
  });


  describe('getVoucherDays', () => {
    it('out of the fast delivery window, it delivers the Saturday paper on the next Saturday after three weeks', () => {
      const days = getVoucherDays(wednesday, 'Saturday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-23');
    });
    it('in the fast delivery window, delivers the Saturday paper on the next Saturday after two weeks', () => {
      const days = getVoucherDays(tuesday, 'Saturday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-16');
    });
  });


});
