// @flow

export type Status = 'On' | 'Off';

type SwitchObject = {
  [string]: Status,
};

export type Switches = {
  [string]: SwitchObject,
};

export type Settings = {
  switches: Switches
};
