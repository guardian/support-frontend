import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { routes } from 'helpers/urls/routes';
import buildCheckoutUrl from './buildCheckoutUrl';

describe('buildCheckoutUrl', () => {
	describe('when the rate plan is Monthly', () => {
		const supportRegionId = SupportRegionId.UK;
		const productKey = 'SupporterPlus';
		const ratePlanKey = 'Monthly';

		it('builds a URL without promoCode', () => {
			const result = buildCheckoutUrl(supportRegionId, productKey, ratePlanKey);
			expect(result).toBe(
				'/uk/checkout?product=SupporterPlus&ratePlan=Monthly&backButton=false',
			);
		});

		it('builds a URL with promoCode', () => {
			const result = buildCheckoutUrl(
				supportRegionId,
				productKey,
				ratePlanKey,
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
				);

				expect(url).toBe(routes.supporterPlusStudentBeansCa);
			});
		});

		describe('and the supportRegionId is not one we have a Student Beans link for', () => {
			it('returns the checkout URL', () => {
				const url = buildCheckoutUrl(
					SupportRegionId.EU,
					'SupporterPlus',
					'OneYearStudent',
				);

				expect(url).toBe(
					'/eu/checkout?product=SupporterPlus&ratePlan=OneYearStudent&backButton=false',
				);
			});
		});
	});
});
