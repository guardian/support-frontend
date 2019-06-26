// @flow

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;
const milsInADay = 1000 * 60 * 60 * 24;

export const numberOfWeeksWeDeliverTo = 4;

const getDateOfDeliveryDayInCurrentWeek = (today: number, day: Day): Date => {
  // For the purposes of fulfilment delays we consider the week to start on Monday
  // so Sunday (day 0) should be day 7
  const todayOffset = new Date(today).getDay() || 7;
  const dayOffset = day || 7;
  const diff = dayOffset - todayOffset;

  return new Date(today + (diff * milsInADay));
};

const getDeliveryDays = (today: number, day: Day, length: number = numberOfWeeksWeDeliverTo): Date[] => {
  const initial = getDateOfDeliveryDayInCurrentWeek(today, day);
  const rt = [initial];
  for (let i = 1; i <= length; i += 1) {
    rt.push(new Date(rt[i - 1].getTime() + (7 * milsInADay)));
  }
  return rt;
};

export { getDeliveryDays };
