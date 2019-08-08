// @flow

const GBSetOne = [{ value: '10' }, { value: '20', isDefault: true }, { value: '30' }, { value: '40' }];
const USSetOne = [{ value: '20' }, { value: '30', isDefault: true }, { value: '40' }, { value: '50' }];
const EURSetOne = [{ value: '30' }, { value: '40', isDefault: true }, { value: '50' }, { value: '60' }];
const AUSetOne = [{ value: '40' }, { value: '50', isDefault: true }, { value: '60' }, { value: '70' }];
const INTSetOne = [{ value: '50' }, { value: '60', isDefault: true }, { value: '70' }, { value: '80' }];
const NZSetOne = [{ value: '60' }, { value: '70', isDefault: true }, { value: '80' }, { value: '90' }];
const CASetOne = [{ value: '70' }, { value: '80', isDefault: true }, { value: '90' }, { value: '100' }];

export const amountsFirstSetOne = {
  GBPCountries: {
    ONE_OFF: GBSetOne,
    MONTHLY: GBSetOne,
    ANNUAL: GBSetOne,
  },
  UnitedStates: {
    ONE_OFF: USSetOne,
    MONTHLY: USSetOne,
    ANNUAL: USSetOne,
  },
  EURCountries: {
    ONE_OFF: EURSetOne,
    MONTHLY: EURSetOne,
    ANNUAL: EURSetOne,
  },
  AUDCountries: {
    ONE_OFF: AUSetOne,
    MONTHLY: AUSetOne,
    ANNUAL: AUSetOne,
  },
  International: {
    ONE_OFF: INTSetOne,
    MONTHLY: INTSetOne,
    ANNUAL: INTSetOne,
  },
  NZDCountries: {
    ONE_OFF: NZSetOne,
    MONTHLY: NZSetOne,
    ANNUAL: NZSetOne,
  },
  Canada: {
    ONE_OFF: CASetOne,
    MONTHLY: CASetOne,
    ANNUAL: CASetOne,
  },
};

const GBSetTwo = [{ value: '15' }, { value: '25', isDefault: true }, { value: '35' }, { value: '45' }];
const USSetTwo = [{ value: '25' }, { value: '35', isDefault: true }, { value: '45' }, { value: '55' }];
const EURSetTwo = [{ value: '35' }, { value: '45', isDefault: true }, { value: '55' }, { value: '65' }];
const AUSetTwo = [{ value: '45' }, { value: '55', isDefault: true }, { value: '65' }, { value: '75' }];
const INTSetTwo = [{ value: '55' }, { value: '65', isDefault: true }, { value: '75' }, { value: '85' }];
const NZSetTwo = [{ value: '65' }, { value: '75', isDefault: true }, { value: '85' }, { value: '95' }];
const CASetTwo = [{ value: '75' }, { value: '85', isDefault: true }, { value: '95' }, { value: '105' }];

export const amountsFirstSetTwo = {
  GBPCountries: {
    ONE_OFF: GBSetTwo,
    MONTHLY: GBSetTwo,
    ANNUAL: GBSetTwo,
  },
  UnitedStates: {
    ONE_OFF: USSetTwo,
    MONTHLY: USSetTwo,
    ANNUAL: USSetTwo,
  },
  EURCountries: {
    ONE_OFF: EURSetTwo,
    MONTHLY: EURSetTwo,
    ANNUAL: EURSetTwo,
  },
  AUDCountries: {
    ONE_OFF: AUSetTwo,
    MONTHLY: AUSetTwo,
    ANNUAL: AUSetTwo,
  },
  International: {
    ONE_OFF: INTSetTwo,
    MONTHLY: INTSetTwo,
    ANNUAL: INTSetTwo,
  },
  NZDCountries: {
    ONE_OFF: NZSetTwo,
    MONTHLY: NZSetTwo,
    ANNUAL: NZSetTwo,
  },
  Canada: {
    ONE_OFF: CASetTwo,
    MONTHLY: CASetTwo,
    ANNUAL: CASetTwo,
  },
};
