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

    // === 24-7 ===
    // Comment the following line and uncomment one after to disable PayPal one-off Flow
    payPal: 'ON', // 24-7 comment this line
    // payPal: 'OFF', //24-7 Uncomment this line
    // === end 24-7 ===
  },
  recurringPaymentMethods: {
    stripe: 'ON',
    payPal: 'ON',
    directDebit: 'ON',
  },
};

const init: () => Switches = () => defaultSwitches;

export { init };
