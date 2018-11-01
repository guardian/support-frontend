// @flow

export type Status = 'On' | 'Off';

export type SwitchObject = {
  [string]: Status,
};

export type Switches = {
  [string]: SwitchObject,
  experiments: {
    [string]: {
      name: string,
      description: string,
      state: Status,
    }
  }
};

export type Settings = {
  switches: Switches,
};
