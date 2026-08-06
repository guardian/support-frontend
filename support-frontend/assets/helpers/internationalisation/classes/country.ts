import type { CountryCode } from '@modules/internationalisation/country';
import {
	countries,
	countryCodeFromString,
	countryCodes,
} from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { supportRegions } from '@modules/internationalisation/supportRegion';
import * as cookie from 'helpers/storage/cookie';
import { getQueryParameter } from 'helpers/urls/url';

type TargetSupportRegions = 'int' | 'eu' | 'nz' | 'uk' | 'au';

export class Country {
	static codeFromString(search: string): CountryCode | null {
		const candidateIso = search.toUpperCase();
		if (candidateIso === 'UK') {
			return 'GB';
		}

		return countryCodeFromString(candidateIso) ?? null;
	}

	static findCountryCode(country?: string | null): CountryCode | null {
		if (!country) {
			return null;
		}

		return (
			this.codeFromString(country) ??
			countryCodes.find((key) => countries[key] === country) ??
			null
		);
	}

	static fromSupportRegionId(
		supportRegionId: SupportRegionId | null | undefined = null,
	): CountryCode | null | undefined {
		switch (supportRegionId) {
			case 'us':
				return 'US';

			case 'ca':
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
			return this.codeFromString(country);
		}

		return null;
	}

	static fromCookie(): CountryCode | null | undefined {
		const country = cookie.get('GU_country');

		if (country) {
			return this.codeFromString(country);
		}

		return null;
	}

	static fromGeolocation(): CountryCode | null | undefined {
		const country = cookie.get('GU_geo_country');

		if (country) {
			return this.codeFromString(country);
		}

		return null;
	}

	static fromOldGeolocation(): CountryCode | null | undefined {
		return this.findCountryCode(window.guardian.geoip?.countryCode);
	}

	static setCountry(country: CountryCode): void {
		cookie.set('GU_country', country, 7);
	}

	static handleCountryForSupportRegion(
		targetSupportRegion: TargetSupportRegions,
		supportRegionId: SupportRegionId | null | undefined = null,
	): CountryCode | null {
		const paths: Record<TargetSupportRegions, string[]> = {
			int: ['/int', '/int/'],
			eu: ['/eu', '/eu/'],
			nz: ['/nz', '/nz/'],
			uk: ['/uk', '/uk/'],
			au: ['/au', '/au/'],
		};
		const defaultCountry: Record<TargetSupportRegions, CountryCode> = {
			int: 'IN',
			eu: 'DE',
			nz: 'NZ',
			uk: 'GB',
			au: 'AU',
		};
		const path = window.location.pathname;

		if (
			path !== paths[targetSupportRegion][0] &&
			!path.startsWith(paths[targetSupportRegion][1] ?? '') &&
			supportRegionId !== targetSupportRegion
		) {
			return null;
		}

		const candidateCountry: CountryCode | null | undefined =
			this.fromQueryParameter() ?? this.fromCookie() ?? this.fromGeolocation();

		if (
			candidateCountry &&
			supportRegions[targetSupportRegion].countries.includes(candidateCountry)
		) {
			return candidateCountry;
		}

		return defaultCountry[targetSupportRegion];
	}

	static detect(
		supportRegionId: SupportRegionId | null | undefined = null,
	): CountryCode {
		const targetSupportRegions: TargetSupportRegions[] = [
			'int',
			'eu',
			'nz',
			'uk',
			'au',
		];
		let country: CountryCode | null = null;

		for (const targetSupportRegionId of targetSupportRegions) {
			const candidateCountry = this.handleCountryForSupportRegion(
				targetSupportRegionId,
				supportRegionId,
			);

			if (candidateCountry !== null) {
				country = candidateCountry;
				break;
			}
		}

		if (country === null) {
			country =
				this.fromSupportRegionId(supportRegionId) ??
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
