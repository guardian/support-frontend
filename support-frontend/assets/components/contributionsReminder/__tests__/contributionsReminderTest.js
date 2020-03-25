// @flow

// ----- Imports ----- //
import { createReminderChoiceSet } from '../contributionsReminder';

// ----- Tests ----- //
describe('createReminderChoiceSet test', () => {
  const december2024 = new Date('2024-12-09');
  const reminderDatesWhenDecember2024 = [
    { dateName: 'March 2025', extendedCopy: 'Three months (March 2025)', timestamp: '2025-03-01 00:00:00' },
    { dateName: 'June 2025', extendedCopy: 'Six months (June 2025)', timestamp: '2025-06-01 00:00:00' },
    { dateName: 'September 2025', extendedCopy: 'Nine months (September 2025)', timestamp: '2025-09-01 00:00:00' },
    { dateName: 'December 2025', extendedCopy: 'Next year (December 2025)', timestamp: '2025-12-01 00:00:00' },
  ];

  const may1985 = new Date('1985-07-20');
  const reminderDatesWhenMay1985 = [
    { dateName: 'August 1985', extendedCopy: 'Three months (August)', timestamp: '1985-08-01 00:00:00' },
    { dateName: 'November 1985', extendedCopy: 'Six months (November)', timestamp: '1985-11-01 00:00:00' },
    { dateName: 'February 1986', extendedCopy: 'Nine months (February 1986)', timestamp: '1986-02-01 00:00:00' },
    { dateName: 'May 1986', extendedCopy: 'Next year (May 1986)', timestamp: '1986-05-01 00:00:00' },
  ];

  const y2k = new Date('2000-01-01');
  const reminderDatesWhenY2k = [
    { dateName: 'April 2000', extendedCopy: 'Three months (April)', timestamp: '2025-04-01 00:00:00' },
    { dateName: 'July 2000', extendedCopy: 'Six months (July)', timestamp: '2025-07-01 00:00:00' },
    { dateName: 'October 2000', extendedCopy: 'Nine months (October)', timestamp: '2025-10-01 00:00:00' },
    { dateName: 'January 2001', extendedCopy: 'Next year (January 2001)', timestamp: '2025-01-01 00:00:00' },
  ];

  it('should create create the right dates for December 2024', () => {
    expect(createReminderChoiceSet(december2024.getMonth(), december2024.getFullYear()))
      .toEqual(reminderDatesWhenDecember2024);
  });

  it('should create create the right dates for May 1985', () => {
    expect(createReminderChoiceSet(may1985.getMonth(), may1985.getFullYear())).toEqual(reminderDatesWhenMay1985);
  });

  it('should create create the right dates for Y2K', () => {
    expect(createReminderChoiceSet(y2k.getMonth(), y2k.getFullYear())).toEqual(reminderDatesWhenY2k);
  });

  it('should not create create the wrong dates for Y2K', () => {
    expect(createReminderChoiceSet(y2k.getMonth(), y2k.getFullYear())).not.toEqual(reminderDatesWhenDecember2024);
  });
});
