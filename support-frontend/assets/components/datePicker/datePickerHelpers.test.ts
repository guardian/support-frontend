// flow
import { dateIsOutsideRange, getRange, getLatestAvailableDateText } from "./helpers";
import { monthText } from "pages/paper-subscription-checkout/helpers/subsCardDays";
describe('datePickerHelpers', () => {
  const RealDate = Date;

  class MockDate extends Date {
    constructor(param) {
      super(param || '2020-05-14T11:01:58.135Z');
    }

  }

  beforeEach(() => {
    global.Date = MockDate;
  });
  afterEach(() => {
    global.Date = RealDate;
  });
  describe('dateIsOutsideRange', () => {
    it('should be able to indicate if a selected date is too far in advance', () => {
      const dateWithinRange = !dateIsOutsideRange(new Date());
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
});