// @flow
import { type Option } from 'helpers/types/option';

export type User = {|
  firstName: Option<string>,
  lastName: Option<string>,
  email: Option<string>,
|};

function getUser(): User {

  if (window && window.guardian && window.guardian.user) {

    const {
      firstName, lastName, email,
    } = window.guardian.user;

    return {
      firstName: typeof firstName === 'string' ? firstName : null,
      lastName: typeof lastName === 'string' ? lastName : null,
      email: typeof email === 'string' ? email : null,
    };
  }

  return {
    firstName: null,
    lastName: null,
    email: null,
  };

}

export { getUser };
