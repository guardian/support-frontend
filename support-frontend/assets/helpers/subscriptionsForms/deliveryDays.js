// @flow

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const milsInADay = 1000 * 60 * 60 * 24;

export const numberOfWeeksWeDeliverTo = 4;

const getNextDayOfTheWeek = (today: number, day: Day): Date => {
  const diff = (7 + (day - new Date(today).getDay())) % 7;
  return new Date(today + (diff * milsInADay));
};

const getNextDaysOfTheWeek = (today: number, day: Day, length: number = numberOfWeeksWeDeliverTo): Date[] => {
  const initial = getNextDayOfTheWeek(today, day);
  const rt = [initial];
  for (let i = 1; i <= length; i += 1) {
    rt.push(new Date(rt[i - 1].getTime() + (7 * milsInADay)));
  }
  return rt;
};

export { getNextDaysOfTheWeek };
