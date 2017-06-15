// @flow

type User = {
  email: string,
  displayName: ?string,
  firstName: ?string,
  lastName: ?string,
};

type Config = {
  user: ?User,
};

const config: Config = {
  user: (window.guardian || {}).user,
};

export default config;
