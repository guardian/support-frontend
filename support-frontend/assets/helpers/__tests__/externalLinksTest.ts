// ----- Imports ----- //
import type { CountryGroupId } from '../internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '../internationalisation/countryGroup';
import {
	androidAppUrl,
	getDailyEditionUrl,
	getIosAppUrl,
} from '../urls/externalLinks';
// ----- Tests ----- //
jest.mock('ophan', () => ({
	viewId: '123456',
}));
describe('externalLinks', () => {
	const uk: CountryGroupId = GBPCountries;
	const us: CountryGroupId = UnitedStates;
	const au: CountryGroupId = AUDCountries;
	const ca: CountryGroupId = Canada;
	const nz: CountryGroupId = NZDCountries;
	const appStoreRoot = 'https://itunes.apple.com';
	const iosPremiumAppProduct = 'app/the-guardian/id409128287';
	const iosDailyEditionProduct =
		'app/guardian-observer-daily-edition/id452707806';
	const iosPremiumTail = '?mt=8';
	// NOTE: all comparisons ignore added parameters
	describe('iOSPremiumAppLink', () => {
		const ukExpectedLink = `${appStoreRoot}/gb/${iosPremiumAppProduct}${iosPremiumTail}`;
		it('should return /gb/ app store link for UK', () => {
			expect(getIosAppUrl(uk).startsWith(ukExpectedLink));
		});
		const auExpectedLink = `${appStoreRoot}/au/${iosPremiumAppProduct}${iosPremiumTail}`;
		it('should return /au/ app store link for AU', () => {
			expect(getIosAppUrl(au).startsWith(auExpectedLink));
		});
		const usExpectedLink = `${appStoreRoot}/us/${iosPremiumAppProduct}${iosPremiumTail}`;
		it('should return /us/ app store link for US', () => {
			expect(getIosAppUrl(us).startsWith(usExpectedLink));
		});
		const nzExpectedLink = `${appStoreRoot}/nz/${iosPremiumAppProduct}${iosPremiumTail}`;
		it('should return /nz/ app store link for NZ', () => {
			expect(getIosAppUrl(nz).startsWith(nzExpectedLink));
		});
		const caExpectedLink = `${appStoreRoot}/ca/${iosPremiumAppProduct}${iosPremiumTail}`;
		it('should return /ca/ app store link for CA', () => {
			expect(getIosAppUrl(ca).startsWith(caExpectedLink));
		});
		const usDefaultLink = `${appStoreRoot}/us/${iosPremiumAppProduct}${iosPremiumTail}`;
		it('should return default /us/ app store link for EU and International countries', () => {
			[EURCountries, International].forEach((c) =>
				expect(getIosAppUrl(c).startsWith(usDefaultLink)),
			);
		});
	});
	describe('iOSDailyEditionLink', () => {
		it('should return /gb/ app store link for UK', () => {
			const ukExpectedLink = `${appStoreRoot}/gb/${iosDailyEditionProduct}${iosPremiumTail}`;
			expect(getDailyEditionUrl(uk).startsWith(ukExpectedLink));
		});
		// The rest of these are mostly pointless as Daily Edition is UK only - but proves it isn't broken anyway
		const auExpectedLink = `${appStoreRoot}/au/${iosDailyEditionProduct}${iosPremiumTail}`;
		it('should return /au/ app store link for AU', () => {
			expect(getDailyEditionUrl(au).startsWith(auExpectedLink));
		});
		const usExpectedLink = `${appStoreRoot}/us/${iosDailyEditionProduct}${iosPremiumTail}`;
		it('should return /us/ app store link for US', () => {
			expect(getDailyEditionUrl(us).startsWith(usExpectedLink));
		});
		const nzExpectedLink = `${appStoreRoot}/nz/${iosDailyEditionProduct}${iosPremiumTail}`;
		it('should return /nz/ app store link for NZ', () => {
			expect(getDailyEditionUrl(nz).startsWith(nzExpectedLink));
		});
		const caExpectedLink = `${appStoreRoot}/ca/${iosDailyEditionProduct}${iosPremiumTail}`;
		it('should return /ca/ app store link for CA', () => {
			expect(getDailyEditionUrl(ca).startsWith(caExpectedLink));
		});
		const usDefaultLink = `${appStoreRoot}/us/${iosDailyEditionProduct}${iosPremiumTail}`;
		it('should return default /us/ app store link for EU and International countries', () => {
			[EURCountries, International].forEach((c) =>
				expect(getDailyEditionUrl(c).startsWith(usDefaultLink)),
			);
		});
	});
	describe('AndroidAppLink', () => {
		const androidPremiumAppLink =
			'https://play.google.com/store/apps/details?id=com.guardian';
		it('should return correct Google play store link for Daily Edition', () => {
			expect(androidAppUrl.startsWith(androidPremiumAppLink));
		});
	});
});
