import type { CountryCode } from '@modules/internationalisation/country';
import {
	countries,
	countryCodes,
	isCountryCode,
} from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
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
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';

type TargetCountryGroups =
	| typeof International
	| typeof EURCountries
	| typeof NZDCountries
	| typeof GBPCountries
	| typeof AUDCountries;

export class Country {
	static fromString(search: string): CountryCode | null | undefined {
		const candidateIso = search.toUpperCase();
		if (candidateIso === 'UK') {
			return 'GB';
		}

		if (isCountryCode(candidateIso)) {
			return candidateIso;
		}

		return null;
	}

	static findCountryCode(country?: string | null): CountryCode | null {
		if (!country) {
			return null;
		}

		return (
			this.fromString(country) ??
			countryCodes.find((key) => countries[key] === country) ??
			null
		);
	}

	static fromCountryGroup(
		countryGroupId: CountryGroupId | null | undefined = null,
	): CountryCode | null | undefined {
		switch (countryGroupId) {
			case UnitedStates:
				return 'US';

			case Canada:
				return 'CA';

			default:
				return null;
		}
	}

	static fromPath(
		path: string = window.location.pathname,
	): CountryCode | null | undefined {
		if (path === '/us' || path.startsWith('/us/')) {
			return 'US';
		} else if (path === '/ca' || path.startsWith('/ca/')) {
			return 'CA';
		}

		return null;
	}

	static fromQueryParameter(): CountryCode | null | undefined {
		const country = getQueryParameter('country');

		if (country) {
			return this.fromString(country);
		}

		return null;
	}

	static fromCookie(): CountryCode | null | undefined {
		const country = cookie.get('GU_country');

		if (country) {
			return this.fromString(country);
		}

		return null;
	}

	static fromGeolocation(): CountryCode | null | undefined {
		const country = cookie.get('GU_geo_country');

		if (country) {
			return this.fromString(country);
		}

		return null;
	}

	static fromOldGeolocation(): CountryCode | null | undefined {
		return this.findCountryCode(window.guardian.geoip?.countryCode);
	}

	static setCountry(country: CountryCode): void {
		cookie.set('GU_country', country, 7);
	}

	static handleCountryForCountryGroup(
		targetCountryGroup: TargetCountryGroups,
		countryGroupId: CountryGroupId | null | undefined = null,
	): CountryCode | null {
		const paths: Record<TargetCountryGroups, string[]> = {
			International: ['/int', '/int/'],
			EURCountries: ['/eu', '/eu/'],
			NZDCountries: ['/nz', '/nz/'],
			GBPCountries: ['/uk', '/uk/'],
			AUDCountries: ['/au', '/au/'],
		};
		const defaultCountry: Record<TargetCountryGroups, CountryCode> = {
			International: 'IN',
			EURCountries: 'DE',
			NZDCountries: 'NZ',
			GBPCountries: 'GB',
			AUDCountries: 'AU',
		};
		const path = window.location.pathname;

		if (
			path !== paths[targetCountryGroup][0] &&
			!path.startsWith(paths[targetCountryGroup][1] ?? '') &&
			countryGroupId !== targetCountryGroup
		) {
			return null;
		}

		const candidateCountry: CountryCode | null | undefined =
			this.fromQueryParameter() ?? this.fromCookie() ?? this.fromGeolocation();

		if (
			candidateCountry &&
			countryGroups[targetCountryGroup].countries.includes(candidateCountry)
		) {
			return candidateCountry;
		}

		return defaultCountry[targetCountryGroup];
	}

	static detect(
		countryGroupId: CountryGroupId | null | undefined = null,
	): CountryCode {
		const targetCountryGroups: TargetCountryGroups[] = [
			International,
			EURCountries,
			NZDCountries,
			GBPCountries,
			AUDCountries,
		];
		let country: CountryCode | null = null;

		for (const targetCountryGroupId of targetCountryGroups) {
			const candidateCountry = this.handleCountryForCountryGroup(
				targetCountryGroupId,
				countryGroupId,
			);

			if (candidateCountry !== null) {
				country = candidateCountry;
				break;
			}
		}

		if (country === null) {
			country =
				this.fromCountryGroup(countryGroupId) ??
				this.fromPath() ??
				this.fromQueryParameter() ??
				this.fromCookie() ??
				this.fromGeolocation() ??
				this.fromOldGeolocation() ??
				'GB';
		}

		this.setCountry(country);

		return country;
	}
}
