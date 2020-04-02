// @flow

export const USV1 = {
  UnitedStates: {
    MONTHLY: [{ value: '5' }, { value: '10', isDefault: true }, { value: '20' }],
  },
};

export const UKV1Lower = {
  GBPCountries: {
    ONE_OFF: [{ value: '10' }, { value: '25', isDefault: true }, { value: '50' }, { value: '100' }],
    ANNUAL: [{ value: '40', isDefault: true }, { value: '80' }, { value: '120' }, { value: '240' }],
  },
};

export const UKV2Higher = {
  GBPCountries: {
    ONE_OFF: [{ value: '30' }, { value: '60', isDefault: true }, { value: '120' }, { value: '240' }],
    MONTHLY: [{ value: '3' }, { value: '7', isDefault: true }, { value: '12' }],
    ANNUAL: [{ value: '60' }, { value: '120', isDefault: true }, { value: '240' }, { value: '480' }],
  },
};
