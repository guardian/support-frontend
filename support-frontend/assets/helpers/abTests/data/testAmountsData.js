// @flow

const USV1 = [{ value: '5' }, { value: '15', isDefault: true }, { value: '25' }, { value: '50' }];
const GBV1 = [{ value: '2' }, { value: '7', isDefault: true }, { value: '25' }, { value: '50' }];
const AUV1 = [{ value: '10' }, { value: '25', isDefault: true }, { value: '50' }, { value: '100' }];
const EURV1 = [{ value: '6' }, { value: '15', isDefault: true }, { value: '35' }, { value: '100' }];
const INTV1 = [{ value: '5' }, { value: '15', isDefault: true }, { value: '35' }, { value: '100' }];
const NZV1 = [{ value: '10' }, { value: '25', isDefault: true }, { value: '50' }, { value: '100' }];
const CAV1 = [{ value: '5' }, { value: '15', isDefault: true }, { value: '35' }, { value: '100' }];

export const V1 = {
  GBPCountries: {
    ONE_OFF: GBV1,
    MONTHLY: GBV1,
    ANNUAL: GBV1,
  },
  UnitedStates: {
    ONE_OFF: USV1,
    MONTHLY: USV1,
    ANNUAL: USV1,
  },
  EURCountries: {
    ONE_OFF: EURV1,
    MONTHLY: EURV1,
    ANNUAL: EURV1,
  },
  AUDCountries: {
    ONE_OFF: AUV1,
    MONTHLY: AUV1,
    ANNUAL: AUV1,
  },
  International: {
    ONE_OFF: INTV1,
    MONTHLY: INTV1,
    ANNUAL: INTV1,
  },
  NZDCountries: {
    ONE_OFF: NZV1,
    MONTHLY: NZV1,
    ANNUAL: NZV1,
  },
  Canada: {
    ONE_OFF: CAV1,
    MONTHLY: CAV1,
    ANNUAL: CAV1,
  },
};
