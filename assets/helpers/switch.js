// @flow

export type Status = 'ON' | 'OFF';

type SwitchObject = {
  [string]: Status,
};

export type Switches = {
  [string]: SwitchObject,
};
