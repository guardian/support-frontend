import type { IsoCountry } from '@modules/internationalisation/country';
import {
	AUDCountries,
	Canada,
	countryGroups,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type {
	CountryGroupId,
	CountryGroupName,
	CountryGroup as CountryGroupType,
} from '@modules/internationalisation/countryGroup';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';
import { Country } from './country';

export class CountryGroup {
	static fromPath(
		path: string = window.location.pathname,
	): CountryGroupId | null | undefined {
		if (path === '/uk' || path.startsWith('/uk/')) {
			return GBPCountries;
		} else if (path === '/us' || path.startsWith('/us/')) {
			return UnitedStates;
		} else if (path === '/au' || path.startsWith('/au/')) {
			return AUDCountries;
		} else if (path === '/eu' || path.startsWith('/eu/')) {
			return EURCountries;
		} else if (path === '/int' || path.startsWith('/int/')) {
			return International;
		} else if (path === '/nz' || path.startsWith('/nz/')) {
			return NZDCountries;
		} else if (path === '/ca' || path.startsWith('/ca/')) {
			return Canada;
		}

		return null;
	}

	static fromString(countryGroup: string): CountryGroupId | null | undefined {
		switch (countryGroup) {
			case 'GBPCountries':
				return GBPCountries;

			case 'UnitedStates':
				return UnitedStates;

			case 'AUDCountries':
				return AUDCountries;

			case 'EURCountries':
				return EURCountries;

			case 'International':
				return International;

			case 'NZDCountries':
				return NZDCountries;

			case 'Canada':
				return Canada;

			default:
				return null;
		}
	}

	static fromCountry(
		isoCountry: IsoCountry,
	): CountryGroupId | null | undefined {
		const countryGroup = (Object.keys(countryGroups) as CountryGroupId[]).find(
			(countryGroupId) =>
				countryGroups[countryGroupId].countries.includes(isoCountry),
		);
		return countryGroup ?? null;
	}

	static fromQueryParameter(): CountryGroupId | null | undefined {
		const countryGroup: string | null | undefined =
			getQueryParameter('countryGroup');

		if (countryGroup) {
			return this.fromString(countryGroup);
		}

		return null;
	}

	static fromCookie(): CountryGroupId | null | undefined {
		const country = cookie.get('GU_country');

		if (country) {
			const isoCountry = Country.fromString(country);
			if (isoCountry) {
				return this.fromCountry(isoCountry);
			}
		}

		return null;
	}

	static fromGeolocation(): CountryGroupId | null | undefined {
		const country = cookie.get('GU_geo_country');

		if (country) {
			const isoCountry = Country.fromString(country);
			if (isoCountry) {
				return this.fromCountry(isoCountry);
			}
		}

		return null;
	}

	static detect(): CountryGroupId {
		return (
			this.fromPath() ??
			this.fromQueryParameter() ??
			this.fromCookie() ??
			this.fromGeolocation() ??
			GBPCountries
		);
	}

	static fromCountryGroupName(name: CountryGroupName): CountryGroupType {
		const groupId = (Object.keys(countryGroups) as CountryGroupId[]).find(
			(key) => countryGroups[key].name === name,
		);
		return groupId ? countryGroups[groupId] : countryGroups.GBPCountries;
	}
}
