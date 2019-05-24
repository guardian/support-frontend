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
const Annual: 'Annual' = 'Annual';
const Quarterly: 'Quarterly' = 'Quarterly';
const SixForSix: 'SixForSix' = 'SixForSix';

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
  | typeof Annual
  | typeof Quarterly
  | typeof SixForSix;

export type PaperProductOptions =
  | typeof Saturday
  | typeof Sunday
  | typeof Weekend
  | typeof Sixday
  | typeof Everyday;

export type WeeklyProductOptions =
  | typeof Annual
  | typeof Quarterly
  | typeof SixForSix;

const ActivePaperProductTypes = [Everyday, Sixday, Weekend, Sunday];
const ActiveWeeklyProductTypes = [Quarterly, Annual, SixForSix];

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
  ActivePaperProductTypes,
  ActiveWeeklyProductTypes,
  Quarterly,
  Annual,
  SixForSix,
};
