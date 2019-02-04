// @flow

// ----- Imports ----- //
import { showCountdownTimer } from '../flashSale';

// ----- Tests ----- //

jest.mock('ophan', () => ({ viewId: '123456' }));

describe('showCountdownTimer', () => {

  const now = new Date();

  const endTimeMoreThanAWeekFromNow = now.setDate(now.getDate() + 8);
  const endTimeThreeDaysFromNow = now.setDate(now.getDate() + 3);

  it('return false if the flash sale is not active', () => {
    expect(showCountdownTimer(false, 7, now.getTime())).toEqual(false);
  });

  it('return true if the end time is three days from now', () => {
    expect(showCountdownTimer(false, 7, endTimeThreeDaysFromNow)).toEqual(false);
  });

  it('return false if the end time too far away', () => {
    expect(showCountdownTimer(false, 7, endTimeMoreThanAWeekFromNow)).toEqual(false);
  });

});
