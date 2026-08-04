import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { supportRegionIdFromCountryCode } from '@modules/internationalisation/supportRegion';
import * as cookie from 'helpers/storage/cookie';
import { Country } from './country';

export class DetectSupportRegion {
	static fromPath(
		path: string = window.location.pathname,
	): SupportRegionId | null | undefined {
		if (path === '/uk' || path.startsWith('/uk/')) {
			return 'uk';
		} else if (path === '/us' || path.startsWith('/us/')) {
			return 'us';
		} else if (path === '/au' || path.startsWith('/au/')) {
			return 'au';
		} else if (path === '/eu' || path.startsWith('/eu/')) {
			return 'eu';
		} else if (path === '/int' || path.startsWith('/int/')) {
			return 'int';
		} else if (path === '/nz' || path.startsWith('/nz/')) {
			return 'nz';
		} else if (path === '/ca' || path.startsWith('/ca/')) {
			return 'ca';
		}

		return null;
	}

	static fromCookie(): SupportRegionId | null | undefined {
		const country = cookie.get('GU_country');

		if (country) {
			const isoCountry = Country.codeFromString(country);
			if (isoCountry) {
				return supportRegionIdFromCountryCode(isoCountry);
			}
		}

		return null;
	}

	static fromGeolocation(): SupportRegionId | null | undefined {
		const country = cookie.get('GU_geo_country');

		if (country) {
			const isoCountry = Country.codeFromString(country);
			if (isoCountry) {
				return supportRegionIdFromCountryCode(isoCountry);
			}
		}

		return null;
	}

	static detect(): SupportRegionId {
		return (
			this.fromPath() ?? this.fromCookie() ?? this.fromGeolocation() ?? 'uk'
		);
	}
}
