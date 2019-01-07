// @flow
import { type Option } from 'helpers/types/option';
import {
  findIsoCountry,
  detect,
  type IsoCountry,
  fromString,
} from 'helpers/internationalisation/country';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';

function getCountryFromIdentity(): Option<IsoCountry> {
  if (window && window.guardian && window.guardian.user) {
    const { country } = window.guardian.user;
    const countryCode = country !== null ? findIsoCountry(country) : null;
    const maybeCountryFromIdentity = countryCode !== null ? fromString(countryCode) : null;
    return typeof maybeCountryFromIdentity === 'string' ? maybeCountryFromIdentity : null;
  }
  return null;
}

function getCountry(countryGroupId: CountryGroupId): Option<IsoCountry> {
  return getCountryFromIdentity() || detect(countryGroupId);
}

export { getCountry };
