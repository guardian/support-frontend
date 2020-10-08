// flow

import {
  dateIsPast,
  dateIsOutsideRange,
  getRange,
  getLatestAvailableDateText,
} from './helpers';
import { monthText } from 'pages/paper-subscription-checkout/helpers/subsCardDays';


describe('dateIsPast', () => {
  it('should be able to indicate if a selected date is in the past', () => {
    const pastDate = new Date('09/23/2020');
    const today = Date.now();
    const resultPast = dateIsPast(pastDate);
    expect(resultPast).toBe(true);

    const resultToday = dateIsPast(new Date(today));
    expect(resultToday).toBe(false);
  });

});

describe('dateIsOutsideRange', () => {
  it('should be able to indicate if a selected date is too far in advance', () => {
    const dateWithinRange = !dateIsOutsideRange(new Date(Date.now()));
    expect(dateWithinRange).toBe(true);

    const rangeDate = new Date();
    rangeDate.setDate(rangeDate.getDate() + 93);
    const dateOutsideRange = dateIsOutsideRange(rangeDate);

    expect(dateOutsideRange).toBe(true);

  });

});

describe('getRange', () => {
  it('should be able to get the latest available date from now', () => {
    const latestAvailable = getRange();
    const rangeDate = new Date();
    rangeDate.setDate(rangeDate.getDate() + 89);

    expect(latestAvailable).toEqual(rangeDate);

  });

});

describe('getLatestAvailableText', () => {
  it('should be able to get the latest available date from now', () => {
    const latestAvailable = getRange();
    const latestAvailableText = getLatestAvailableDateText();

    expect(latestAvailableText).toBe(`${latestAvailable.getDate()} ${monthText[latestAvailable.getMonth()]} ${latestAvailable.getFullYear()}`);

  });

});

