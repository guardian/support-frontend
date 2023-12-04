import * as cookie from 'helpers/storage/cookie';
import type { Option } from 'helpers/types/option';
import { getQueryParameter } from 'helpers/urls/url';
import type {
	AuState,
	CaState,
	IsoCountry,
	StateProvince,
	UsState,
} from './country';
import {
	auStates,
	caStates,
	countries,
	isoCountries,
	isoCountrySet,
	usStates,
} from './country';
import {
	AUDCountries,
	Canada,
	countryGroups,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from './countryGroup';
import type {
	CountryGroup,
	CountryGroupId,
	CountryGroupName,
} from './countryGroup';

type TargetCountryGroups =
	| typeof International
	| typeof EURCountries
	| typeof NZDCountries
	| typeof GBPCountries
	| typeof AUDCountries;

class CountryHelper {
	static stateProvinceFromMap(
		l: string,
		states: Record<string, string>,
	): StateProvince | null | undefined {
		const s = l.toUpperCase();
		return states[s]
			? s
			: Object.keys(states).find(
					(key) =>
						states[key].toUpperCase() === s ||
						(s.length === 3 && s.startsWith(key)),
			  );
	}

	static usStateFromString(s: string): Option<UsState> {
		return this.stateProvinceFromMap(s, usStates) ?? null;
	}

	static caStateFromString(s: string): Option<CaState> {
		return this.stateProvinceFromMap(s, caStates) ?? null;
	}

	static auStateFromString(s: string): Option<AuState> {
		return this.stateProvinceFromMap(s, auStates) ?? null;
	}

	static stateProvinceFieldFromString(
		countryGroupId: CountryGroupId | null | undefined,
		s?: string,
	): Option<StateProvince> {
		if (!s) {
			return null;
		}

		switch (countryGroupId) {
			case UnitedStates:
				return this.usStateFromString(s);

			case Canada:
				return this.caStateFromString(s);

			case AUDCountries:
				return this.auStateFromString(s);

			default:
				return null;
		}
	}

	static stateProvinceFromString(
		country: Option<IsoCountry>,
		s?: string,
	): Option<StateProvince> {
		if (!s) {
			return null;
		}

		switch (country) {
			case 'US':
				return this.usStateFromString(s);

			case 'CA':
				return this.caStateFromString(s);

			case 'AU':
				return this.auStateFromString(s);

			default:
				return null;
		}
	}

	static fromString(s: string): IsoCountry | null | undefined {
		const candidateIso = s.toUpperCase();
		if (candidateIso === 'UK') {
			return 'GB';
		}

		if (this.isIsoCountry(candidateIso)) {
			return candidateIso;
		}

		return null;
	}

	static isIsoCountry(s: string): s is IsoCountry {
		return isoCountrySet.has(s as IsoCountry);
	}

	static findIsoCountry(country?: string | null): Option<IsoCountry> {
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
			!path.startsWith(paths[targetCountryGroup][1]) &&
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

class CountryGroupHelper {
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
			const isoCountry = CountryHelper.fromString(country);
			if (isoCountry) {
				return this.fromCountry(isoCountry);
			}
		}

		return null;
	}

	static fromGeolocation(): CountryGroupId | null | undefined {
		const country = cookie.get('GU_geo_country');

		if (country) {
			const isoCountry = CountryHelper.fromString(country);
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

	static stringToCountryGroupId(countryGroupId: string): CountryGroupId {
		return this.fromString(countryGroupId) ?? GBPCountries;
	}

	static fromCountryGroupName(name: CountryGroupName): CountryGroup {
		const groupId = (Object.keys(countryGroups) as CountryGroupId[]).find(
			(key) => countryGroups[key].name === name,
		);
		return groupId ? countryGroups[groupId] : countryGroups.GBPCountries;
	}
}

export { CountryHelper as Country, CountryGroupHelper as CountryGroup };
