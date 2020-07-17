// @flow

export const USV1 = {
  UnitedStates: {
    MONTHLY: [{ value: '5' }, { value: '10', isDefault: true }, { value: '20' }],
  },
};

export const AusAmounts = {
  AUDCountries: {
    ONE_OFF: [{ value: '100' }, { value: '150', isDefault: true }, { value: '250' }, { value: '500' }],
    MONTHLY: [{ value: '10' }, { value: '25', isDefault: true }, { value: '50' }],
    ANNUAL: [{ value: '100', isDefault: true }, { value: '250' }, { value: '500' }, { value: '1000' }],
  },
};

export const UkAmountsV1 = {
  GBPCountries: {
    ONE_OFF: [{ value: '35' }, { value: '70', isDefault: true }, { value: '140' }, { value: '280' }],
    MONTHLY: [{ value: '4' }, { value: '8', isDefault: true }, { value: '16' }],
    ANNUAL: [{ value: '75', isDefault: true }, { value: '150' }, { value: '300' }, { value: '500' }],
  },
};

export const UkAmountsV2 = {
  GBPCountries: {
    ONE_OFF: [{ value: '52' }, { value: '104', isDefault: true }, { value: '150' }, { value: '300' }],
    MONTHLY: [{ value: '4.34' }, { value: '13', isDefault: true }, { value: '21.68' }],
    ANNUAL: [{ value: '104', isDefault: true }, { value: '156' }, { value: '208' }, { value: '260' }],
  },
};
