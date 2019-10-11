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

const USV2 = [{ value: '5' }, { value: '15' }, { value: '25', isDefault: true }, { value: '50' }];
const GBV2 = [{ value: '2' }, { value: '7' }, { value: '25', isDefault: true }, { value: '50' }];
const AUV2 = [{ value: '10' }, { value: '25' }, { value: '50', isDefault: true }, { value: '100' }];
const EURV2 = [{ value: '6' }, { value: '15' }, { value: '35', isDefault: true }, { value: '100' }];
const INTV2 = [{ value: '5' }, { value: '15' }, { value: '35', isDefault: true }, { value: '100' }];
const NZV2 = [{ value: '10' }, { value: '25' }, { value: '50', isDefault: true }, { value: '100' }];
const CAV2 = [{ value: '5' }, { value: '15' }, { value: '35', isDefault: true }, { value: '100' }];

export const V2 = {
  GBPCountries: {
    ONE_OFF: GBV2,
    MONTHLY: GBV2,
    ANNUAL: GBV2,
  },
  UnitedStates: {
    ONE_OFF: USV2,
    MONTHLY: USV2,
    ANNUAL: USV2,
  },
  EURCountries: {
    ONE_OFF: EURV2,
    MONTHLY: EURV2,
    ANNUAL: EURV2,
  },
  AUDCountries: {
    ONE_OFF: AUV2,
    MONTHLY: AUV2,
    ANNUAL: AUV2,
  },
  International: {
    ONE_OFF: INTV2,
    MONTHLY: INTV2,
    ANNUAL: INTV2,
  },
  NZDCountries: {
    ONE_OFF: NZV2,
    MONTHLY: NZV2,
    ANNUAL: NZV2,
  },
  Canada: {
    ONE_OFF: CAV2,
    MONTHLY: CAV2,
    ANNUAL: CAV2,
  },
};
