// @flow

export type Status = 'On' | 'Off';

export type SwitchObject = {
  [string]: Status,
};

export type Switches = {
  [string]: SwitchObject,
};

export type Settings = {
  switches: Switches
};
