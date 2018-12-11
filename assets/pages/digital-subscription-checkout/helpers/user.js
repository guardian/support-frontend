// @flow
import { type Option } from 'helpers/types/option';

export type User = {|
  firstName: Option<string>,
  lastName: Option<string>,
  email: Option<string>,
|};

function getUser(): User {

  if (window && window.guardian && window.guardian.user) {
    return {
      firstName: window.guardian.user.firstName || null,
      lastName: window.guardian.user.lastName || null,
      email: window.guardian.user.email || null,
    };
  }

  return {
    firstName: null,
    lastName: null,
    email: null,
  };

}

export { getUser };
