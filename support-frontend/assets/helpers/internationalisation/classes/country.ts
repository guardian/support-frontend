import type {
	AuState,
	CaState,
	IsoCountry,
	StateProvince,
	UsState,
} from '@modules/internationalisation/country';
import {
	auStates,
	caStates,
	countries,
	isoCountries,
	isoCountrySet,
	usStates,
} from '@modules/internationalisation/country';
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
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';

type TargetCountryGroups =
	| typeof International
	| typeof EURCountries
	| typeof NZDCountries
	| typeof GBPCountries
	| typeof AUDCountries;

export class Country {
	static stateProvinceFromMap(
		search: string,
		states: Record<string, string>,
	): StateProvince | null | undefined {
		const searchUppercase = search.toUpperCase();
		return states[searchUppercase]
			? searchUppercase
			: Object.keys(states).find(
					(key) =>
						states[key]?.toUpperCase() === searchUppercase ||
						(searchUppercase.length === 3 && searchUppercase.startsWith(key)),
			  );
	}

	static usStateFromString(search: string): UsState | null {
		return this.stateProvinceFromMap(search, usStates) ?? null;
	}

	static caStateFromString(search: string): CaState | null {
		return this.stateProvinceFromMap(search, caStates) ?? null;
	}

	static auStateFromString(search: string): AuState | null {
		return this.stateProvinceFromMap(search, auStates) ?? null;
	}

	static stateProvinceFieldFromString(
		countryGroupId: CountryGroupId | null | undefined,
		search?: string,
	): StateProvince | null {
		if (!search) {
			return null;
		}

		switch (countryGroupId) {
			case UnitedStates:
				return this.usStateFromString(search);

			case Canada:
				return this.caStateFromString(search);

			case AUDCountries:
				return this.auStateFromString(search);

			default:
				return null;
		}
	}

	static stateProvinceFromString(
		country: IsoCountry | null,
		search?: string,
	): StateProvince | null {
		if (!search) {
			return null;
		}

		switch (country) {
			case 'US':
				return this.usStateFromString(search);

			case 'CA':
				return this.caStateFromString(search);

			case 'AU':
				return this.auStateFromString(search);

			default:
				return null;
		}
	}

	static fromString(search: string): IsoCountry | null | undefined {
		const candidateIso = search.toUpperCase();
		if (candidateIso === 'UK') {
			return 'GB';
		}

		if (this.isIsoCountry(candidateIso)) {
			return candidateIso;
		}

		return null;
	}

	static isIsoCountry(search: string): search is IsoCountry {
		return isoCountrySet.has(search as IsoCountry);
	}

	static findIsoCountry(country?: string | null): IsoCountry | null {
		if (!country) {
			return null;
		}

		return (
			this.fromString(country) ??
			isoCountries.find((key) => countries[key] === country) ??
			null
		);
	}

	static fromCountryGroup(
		countryGroupId: CountryGroupId | null | undefined = null,
	): IsoCountry | null | undefined {
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
	): IsoCountry | null | undefined {
		if (path === '/us' || path.startsWith('/us/')) {
			return 'US';
		} else if (path === '/ca' || path.startsWith('/ca/')) {
			return 'CA';
		}

		return null;
	}

	static fromQueryParameter(): IsoCountry | null | undefined {
		const country = getQueryParameter('country');

		if (country) {
			return this.fromString(country);
		}

		return null;
	}

	static fromCookie(): IsoCountry | null | undefined {
		const country = cookie.get('GU_country');

		if (country) {
			return this.fromString(country);
		}

		return null;
	}

	static fromGeolocation(): IsoCountry | null | undefined {
		const country = cookie.get('GU_geo_country');

		if (country) {
			return this.fromString(country);
		}

		return null;
	}

	static fromOldGeolocation(): IsoCountry | null | undefined {
		return this.findIsoCountry(window.guardian.geoip?.countryCode);
	}

	static setCountry(country: IsoCountry): void {
		cookie.set('GU_country', country, 7);
	}

	static handleCountryForCountryGroup(
		targetCountryGroup: TargetCountryGroups,
		countryGroupId: CountryGroupId | null | undefined = null,
	): IsoCountry | null {
		const paths: Record<TargetCountryGroups, string[]> = {
			International: ['/int', '/int/'],
			EURCountries: ['/eu', '/eu/'],
			NZDCountries: ['/nz', '/nz/'],
			GBPCountries: ['/uk', '/uk/'],
			AUDCountries: ['/au', '/au/'],
		};
		const defaultCountry: Record<TargetCountryGroups, IsoCountry> = {
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

		const candidateCountry: IsoCountry | null | undefined =
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
	): IsoCountry {
		const targetCountryGroups: TargetCountryGroups[] = [
			International,
			EURCountries,
			NZDCountries,
			GBPCountries,
			AUDCountries,
		];
		let country: IsoCountry | null = null;

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
