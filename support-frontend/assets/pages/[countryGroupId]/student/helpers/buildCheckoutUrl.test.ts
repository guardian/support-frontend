import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { routes } from 'helpers/urls/routes';
import buildCheckoutUrl from './buildCheckoutUrl';

describe('buildCheckoutUrl', () => {
	describe('when the rate plan is Monthly', () => {
		const supportRegionId = SupportRegionId.UK;
		const productKey = 'SupporterPlus';
		const ratePlanKey = 'Monthly';

		it('builds a URL without promoCode', () => {
			const result = buildCheckoutUrl(
				supportRegionId,
				productKey,
				ratePlanKey,
				true,
			);
			expect(result).toBe(
				'/uk/checkout?product=SupporterPlus&ratePlan=Monthly&backButton=false',
			);
		});

		it('builds a URL with promoCode', () => {
			const result = buildCheckoutUrl(
				supportRegionId,
				productKey,
				ratePlanKey,
				true,
				'DISCOUNT10',
			);
			expect(result).toBe(
				'/uk/checkout?product=SupporterPlus&ratePlan=Monthly&backButton=false&promoCode=DISCOUNT10',
			);
		});
	});

	describe('when the rate plan is OneYearStudent', () => {
		describe('and the supportRegionId is uk', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.UK,
					'SupporterPlus',
					'OneYearStudent',
					false,
				);

				expect(url).toBe(routes.supporterPlusStudentBeansUk);
			});
		});

		describe('and the supportRegionId is us', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.US,
					'SupporterPlus',
					'OneYearStudent',
					false,
				);

				expect(url).toBe(routes.supporterPlusStudentBeansUs);
			});
		});

		describe('and the supportRegionId is ca', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.CA,
					'SupporterPlus',
					'OneYearStudent',
					false,
				);

				expect(url).toBe(routes.supporterPlusStudentBeansCa);
			});
		});

		describe('and the supportRegionId is eu with defined country DE', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'SupporterPlus',
					'OneYearStudent',
					true,
					undefined,
					'DE',
				);
				expect(url).toBe(routes.supporterPlusStudentBeansDe);
			});
		});
		describe('and the supportRegionId is eu with defined country FR', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'SupporterPlus',
					'OneYearStudent',
					true,
					undefined,
					'FR',
				);
				expect(url).toBe(routes.supporterPlusStudentBeansFr);
			});
		});
		describe('and the supportRegionId is eu with defined country ES', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'SupporterPlus',
					'OneYearStudent',
					true,
					undefined,
					'ES',
				);
				expect(url).toBe(routes.supporterPlusStudentBeansEs);
			});
		});
		describe('and the supportRegionId is eu with defined country IE', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'SupporterPlus',
					'OneYearStudent',
					true,
					undefined,
					'IE',
				);
				expect(url).toBe(routes.supporterPlusStudentBeansIe);
			});
		});
		describe('and the supportRegionId is eu with defined country NL', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'SupporterPlus',
					'OneYearStudent',
					true,
					undefined,
					'NL',
				);
				expect(url).toBe(routes.supporterPlusStudentBeansNl);
			});
		});

		describe('and the EU supportRegionId with country IT is not one we have a Student Beans link for', () => {
			it('returns the checkout URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'SupporterPlus',
					'OneYearStudent',
					true,
					undefined,
					'IT',
				);

				expect(url).toBe(
					'/eu/checkout?product=SupporterPlus&ratePlan=OneYearStudent&backButton=false',
				);
			});
		});
		describe('and the NZ supportRegionId is not one we have a Student Beans link for', () => {
			it('returns the checkout URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.NZ,
					'SupporterPlus',
					'OneYearStudent',
					true,
				);

				expect(url).toBe(
					'/nz/checkout?product=SupporterPlus&ratePlan=OneYearStudent&backButton=false',
				);
			});
		});
	});
});
