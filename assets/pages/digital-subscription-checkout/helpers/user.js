// @flow
import { type Option } from 'helpers/types/option';
import {
  findIsoCountry,
  detect,
  type IsoCountry,
  fromString,
} from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

export type User = {|
  firstName: Option<string>,
  lastName: Option<string>,
  email: Option<string>,
  country: Option<IsoCountry>,
|};

function getCountry(country: Option<string>, countryGroupId: CountryGroupId): Option<IsoCountry> {
  const countryCode = country !== null ? findIsoCountry(country) : null;
  const maybeCountryFromIdentity = countryCode !== null ? fromString(countryCode) : null;
  const optionCountryFromIdentity = typeof maybeCountryFromIdentity === 'string' ? maybeCountryFromIdentity : null;
  const countryFromCountryGroupId = detect(countryGroupId);

  return optionCountryFromIdentity || countryFromCountryGroupId;
}

function getUser(countryGroupId: CountryGroupId): User {

  if (window && window.guardian && window.guardian.user) {

    const {
      firstName, lastName, email, country,
    } = window.guardian.user;

    return {
      firstName: typeof firstName === 'string' ? firstName : null,
      lastName: typeof lastName === 'string' ? lastName : null,
      email: typeof email === 'string' ? email : null,
      country: typeof country === 'string' ? getCountry(country, countryGroupId) : getCountry(null, countryGroupId),
    };
  }

  return {
    firstName: null,
    lastName: null,
    email: null,
    country: null,
  };

}

export { getUser, getCountry };
