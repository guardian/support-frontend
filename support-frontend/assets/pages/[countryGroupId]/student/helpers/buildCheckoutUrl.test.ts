import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { routes } from 'helpers/urls/routes';
import buildCheckoutUrl, { routeInclCountry } from './buildCheckoutUrl';

jest.mock('contexts/FeatureSwitchesContext', () => ({
	__esModule: true,
	useFeatureSwitches: jest
		.fn()
		.mockReturnValue({ enableStudentBeansEurope: true }),
}));

describe('buildCheckoutUrl', () => {
	describe('when the rate plan is Monthly', () => {
		const supportRegionId = SupportRegionId.UK;
		const productKey = 'SupporterPlus';
		const ratePlanKey = 'Monthly';

		it('builds a URL without promoCode', () => {
			const result = buildCheckoutUrl(
				supportRegionId,
				'GB',
				productKey,
				ratePlanKey,
			);
			expect(result).toBe(
				'/uk/checkout?product=SupporterPlus&ratePlan=Monthly&backButton=false',
			);
		});

		it('builds a URL with promoCode', () => {
			const result = buildCheckoutUrl(
				supportRegionId,
				'GB',
				productKey,
				ratePlanKey,
				'DISCOUNT10',
			);
			expect(result).toBe(
				'/uk/checkout?product=SupporterPlus&ratePlan=Monthly&backButton=false&promoCode=DISCOUNT10',
			);
		});
	});

	describe('when the rate plan is OneYearStudent (enableStudentBeansEurope:true)', () => {
		describe('and the supportRegionId is eu with defined country DE', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'DE',
					'SupporterPlus',
					'OneYearStudent',
				);
				expect(url).toBe(
					routeInclCountry(routes.supporterPlusStudentBeansEu, 'DE'),
				);
			});
		});
		describe('and the supportRegionId is eu with defined country FR', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'FR',
					'SupporterPlus',
					'OneYearStudent',
				);
				expect(url).toBe(
					routeInclCountry(routes.supporterPlusStudentBeansEu, 'FR'),
				);
			});
		});
		describe('and the supportRegionId is eu with defined country ES', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'ES',
					'SupporterPlus',
					'OneYearStudent',
				);
				expect(url).toBe(
					routeInclCountry(routes.supporterPlusStudentBeansEu, 'ES'),
				);
			});
		});
		describe('and the supportRegionId is eu with defined country IE', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'IE',
					'SupporterPlus',
					'OneYearStudent',
				);
				expect(url).toBe(
					routeInclCountry(routes.supporterPlusStudentBeansEu, 'IE'),
				);
			});
		});
		describe('and the supportRegionId is eu with defined country NL', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'NL',
					'SupporterPlus',
					'OneYearStudent',
				);
				expect(url).toBe(
					routeInclCountry(routes.supporterPlusStudentBeansEu, 'NL'),
				);
			});
		});
		describe('and the EU supportRegionId with country IT is not one we have a Student Beans link for', () => {
			it('returns the checkout URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'IT',
					'SupporterPlus',
					'OneYearStudent',
				);
				expect(url).toBe(routeInclCountry(routes.contributeEu, 'IT'));
			});
		});
		describe('and the NZ supportRegionId is not one we have a Student Beans link for', () => {
			it('returns the checkout URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.NZ,
					'NZ',
					'SupporterPlus',
					'OneYearStudent',
				);

				expect(url).toBe(
					'/nz/checkout?product=SupporterPlus&ratePlan=OneYearStudent&backButton=false',
				);
			});
		});
	});

	describe('when the rate plan is OneYearStudent (enableStudentBeansEurope:false)', () => {
		beforeAll(() => {
			jest.mocked(useFeatureSwitches).mockReturnValue({
				enableStudentBeansEurope: false,
			} as ReturnType<typeof useFeatureSwitches>);
		});
		describe('and the supportRegionId is uk', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.UK,
					'GB',
					'SupporterPlus',
					'OneYearStudent',
				);

				expect(url).toBe(routes.supporterPlusStudentBeansUk);
			});
		});
		describe('and the supportRegionId is us', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.US,
					'US',
					'SupporterPlus',
					'OneYearStudent',
				);

				expect(url).toBe(routes.supporterPlusStudentBeansUs);
			});
		});
		describe('and the supportRegionId is ca', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.CA,
					'CA',
					'SupporterPlus',
					'OneYearStudent',
				);

				expect(url).toBe(routes.supporterPlusStudentBeansCa);
			});
		});
		describe('and the supportRegionId is eu with defined country DE', () => {
			it('returns the correct Tier Three Landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'DE',
					'SupporterPlus',
					'OneYearStudent',
				);
				expect(url).toBe(routeInclCountry(routes.contributeEu, 'DE'));
			});
		});
	});
});
