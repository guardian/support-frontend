// @flow

const USSetOne = [{ value: '7' }, { value: '15', isDefault: true }, { value: '30' }, { value: '50' }];
const GBSetOne = [{ value: '2' }, { value: '5', isDefault: true }, { value: '10' }, { value: '25' }];
const AUSetOne = [{ value: '10' }, { value: '20', isDefault: true }, { value: '40' }, { value: '80' }];
const EURSetOne = [{ value: '6' }, { value: '10', isDefault: true }, { value: '20' }, { value: '50' }];
const INTSetOne = [{ value: '5' }, { value: '10', isDefault: true }, { value: '20' }, { value: '50' }];
const NZSetOne = [{ value: '10' }, { value: '20', isDefault: true }, { value: '50' }, { value: '100' }];
const CASetOne = [{ value: '5' }, { value: '10', isDefault: true }, { value: '20' }, { value: '50' }];

export const SetOne = {
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

const USSetTwo = [{ value: '10' }, { value: '15', isDefault: true }, { value: '25' }, { value: '50' }];
const GBSetTwo = [{ value: '2' }, { value: '7', isDefault: true }, { value: '25' }, { value: '50' }];
const AUSetTwo = [{ value: '10' }, { value: '25', isDefault: true }, { value: '50' }, { value: '100' }];
const EURSetTwo = [{ value: '6' }, { value: '15', isDefault: true }, { value: '35' }, { value: '100' }];
const INTSetTwo = [{ value: '5' }, { value: '15', isDefault: true }, { value: '35' }, { value: '100' }];
const NZSetTwo = [{ value: '10' }, { value: '25', isDefault: true }, { value: '50' }, { value: '100' }];
const CASetTwo = [{ value: '5' }, { value: '15', isDefault: true }, { value: '35' }, { value: '100' }];

export const SetTwo = {
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
