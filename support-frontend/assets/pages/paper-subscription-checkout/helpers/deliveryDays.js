// @flow
type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const milsInADay = 1000 * 60 * 60 * 24;

const MAX_WEEKS_AVAILABLE = 4;

// The cut off for getting vouchers in two weeks is Wednesday (day #3 in ISO format) at 6 AM GMT
const CUTOFF_WEEKDAY = 3;
const CUTOFF_HOUR = 6;

const voucherNormalDelayWeeks = 2;
const voucherExtraDelayWeeks = 3;

const getNextDayOfTheWeek = (today: number, day: Day): Date => {
  const diff = (7 + (day - new Date(today).getDay())) % 7;
  return new Date(today + (diff * milsInADay));
};

const getNextDaysOfTheWeek = (today: number, day: Day, length: number = MAX_WEEKS_AVAILABLE): Date[] => {
  const initial = getNextDayOfTheWeek(today, day);
  const rt = [initial];
  for (let i = 1; i <= length; i += 1) {
    rt.push(new Date(rt[i - 1].getTime() + (7 * milsInADay)));
  }
  return rt;
};

const getVoucherDays = (today: number, day: Day) => {
  const now = new Date(today);
  const [currentWeekday, currentHour] = [now.getDay(), now.getHours()];
  const weeksToAdd = currentWeekday >= CUTOFF_WEEKDAY && currentHour >= CUTOFF_HOUR
    ? voucherExtraDelayWeeks : voucherNormalDelayWeeks;
  console.log([currentWeekday, currentHour, weeksToAdd]);
  return getNextDaysOfTheWeek(today, day, MAX_WEEKS_AVAILABLE + weeksToAdd).splice(weeksToAdd);

};


export { getNextDayOfTheWeek, getNextDaysOfTheWeek, getVoucherDays };
