// @flow

type ReminderDate = {
  dateName: string,
  extendedCopy: string,
  timeStamp: string,
}

const getReminderCopy = (index: number): string => {
  switch (index) {
    case 0:
      return 'Three months';
    case 1:
      return 'Six months';
    case 2:
      return 'Nine months';
    case 3:
      return 'Next year';
    default:
      return '';
  }
};

export const createReminderChoiceSet = (month: number, year: number): Array<ReminderDate> => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const reminderMonthIdxs = [month + 3, month + 6, month + 9, month + 12];
  const reminderChoiceSet = [];

  for (let i = 0; i < reminderMonthIdxs.length; i += 1) {
    let reminderMonthAsIdx; let reminderYear;

    if (reminderMonthIdxs[i] <= 11) {
      reminderMonthAsIdx = reminderMonthIdxs[i];
      reminderYear = year;
    } else {
      reminderMonthAsIdx = reminderMonthIdxs[i] - months.length;
      reminderYear = year + 1;
    }

    const reminderMonthForTimestamp = reminderMonthAsIdx + 1 < 10 ? `0${reminderMonthAsIdx + 1}` : reminderMonthAsIdx + 1;
    const reminderMonthAsWord = months[reminderMonthAsIdx];

    reminderChoiceSet.push({
      dateName: `${reminderMonthAsWord} ${reminderYear}`,
      extendedCopy: `${getReminderCopy(i)} (${reminderMonthAsWord}${reminderYear !== year ? ` ${reminderYear}` : ''})`,
      timeStamp: `${reminderYear}-${reminderMonthForTimestamp}-01 00:00:00`,
    });
  }

  return reminderChoiceSet;
};
