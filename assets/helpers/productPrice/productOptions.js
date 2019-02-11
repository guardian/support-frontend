// @flow

// describes options relating to a product itself - only relevant for paper currently

const NoProductOptions: 'NoProductOptions' = 'NoProductOptions';
const Saturday: 'Saturday' = 'Saturday';
const SaturdayPlus: 'SaturdayPlus' = 'SaturdayPlus';
const Sunday: 'Sunday' = 'Sunday';
const SundayPlus: 'SundayPlus' = 'SundayPlus';
const Weekend: 'Weekend' = 'Weekend';
const WeekendPlus: 'WeekendPlus' = 'WeekendPlus';
const Sixday: 'Sixday' = 'Sixday';
const SixdayPlus: 'SixdayPlus' = 'SixdayPlus';
const Everyday: 'Everyday' = 'Everyday';
const EverydayPlus: 'EverydayPlus' = 'EverydayPlus';

export type ProductOptions =
  typeof NoProductOptions
  | typeof Saturday
  | typeof SaturdayPlus
  | typeof Sunday
  | typeof SundayPlus
  | typeof Weekend
  | typeof WeekendPlus
  | typeof Sixday
  | typeof SixdayPlus
  | typeof Everyday
  | typeof EverydayPlus

export {
  NoProductOptions,
  Saturday,
  SaturdayPlus,
  Sunday,
  SundayPlus,
  Weekend,
  WeekendPlus,
  Sixday,
  SixdayPlus,
  Everyday,
  EverydayPlus,
};
