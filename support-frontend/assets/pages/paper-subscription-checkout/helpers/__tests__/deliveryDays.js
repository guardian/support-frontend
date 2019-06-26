// @flow

// ----- Imports ----- //

import { getVoucherDays, getHomeDeliveryDays } from '../deliveryDays';
import { formatMachineDate, formatUserDate } from 'helpers/dateConversions';


// ----- Tests ----- //
const monday = 1551075752198; /* 2019-02-25 */
const tuesday = 1551175752198; /* 2019-02-26 */
const wednesday5amGMT = 1551243600000; /* 2019-02-27 05:00 GMT */
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

  // TODO: re-enable these once home delivery available again
  xdescribe('getHomeDeliveryDays', () => {
    it('delivers the Sunday paper on the next Sunday', () => {
      const days = getHomeDeliveryDays(wednesday, 'Sunday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-03');
    });
    it('delivers the Monday paper on the next Monday even if it\'s a Sunday', () => {
      const days = getHomeDeliveryDays(sunday, 'Everyday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-04');
    });
  });


  describe('getVoucherDays', () => {
    it('outside of the fast delivery window, delivers the Saturday paper on the next Saturday, four weeks after the preceding Monday', () => {
      const days = getVoucherDays(wednesday, 'Saturday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-30');
    });
    it('outside the fast delivery window, delivers Sixday on the next Monday, four weeks after the preceding Monday', () => {
      const days = getVoucherDays(wednesday, 'Sixday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-25');
    });

    it('in the fast delivery window, delivers the Saturday paper on the next Saturday, three weeks after the preceding Monday', () => {
      const days = getVoucherDays(tuesday, 'Saturday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-23');
    });
    it('just inside the fast delivery window, delivers the Saturday paper on the next Saturday, three weeks after the preceding Monday', () => {
      const days = getVoucherDays(wednesday5amGMT, 'Saturday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-23');
    });
    it('inside the fast delivery window, delivers Sixday on the next Monday, three weeks after the preceding Monday', () => {
      const days = getVoucherDays(tuesday, 'Sixday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-18');
    });
    it('inside the fast delivery window, delivers Sixday on the next Monday, three weeks after the preceding Monday - even on a Monday', () => {
      const days = getVoucherDays(monday, 'Sixday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-18');
    });
    it('inside the fast delivery window, delivers Sunday on the next Sunday, three weeks after the preceding Monday', () => {
      const days = getVoucherDays(tuesday, 'Sunday');
      expect(formatMachineDate(days[0])).toEqual('2019-03-24');
    });
  });


});
