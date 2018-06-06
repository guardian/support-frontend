// @flow

export type Status = 'ON' | 'OFF';

type SwitchObject = {
  [string]: Status,
};

export type Switches = {
  [string]: SwitchObject,
};


// ----- Default state ----- //

const defaultSwitches: Switches = {
  oneOffPaymentMethods: {
    stripe: 'ON',
    payPal: 'ON',
  },
  recurringPaymentMethods: {
    stripe: 'ON',
    payPal: 'ON',
    directDebit: 'ON',
  },
};

const init: () => Switches = () => defaultSwitches;

export { init };
