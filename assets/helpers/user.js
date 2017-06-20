// @flow

type User = {
  email: string,
  displayName: ?string,
  firstName: ?string,
  lastName: ?string,
};

const user: ?User = (window.guardian || {}).user;

export default user;
