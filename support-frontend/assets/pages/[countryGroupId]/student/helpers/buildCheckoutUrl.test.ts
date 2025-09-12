import { routes } from 'helpers/urls/routes';
import buildCheckoutUrl from './buildCheckoutUrl';

describe('buildCheckoutUrl', () => {
	describe('when the rate plan is Monthly', () => {
		const geoId = 'uk';
		const productKey = 'SupporterPlus';
		const ratePlanKey = 'Monthly';

		it('builds a URL without promoCode', () => {
			const result = buildCheckoutUrl(geoId, productKey, ratePlanKey);
			expect(result).toBe(
				'/uk/checkout?product=SupporterPlus&ratePlan=Monthly&backButton=false',
			);
		});

		it('builds a URL with promoCode', () => {
			const result = buildCheckoutUrl(
				geoId,
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
		describe('and the geoId is uk', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl('uk', 'SupporterPlus', 'OneYearStudent');

				expect(url).toBe(routes.supporterPlusStudentBeansUk);
			});
		});

		describe('and the geoId is us', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl('us', 'SupporterPlus', 'OneYearStudent');

				expect(url).toBe(routes.supporterPlusStudentBeansUs);
			});
		});

		describe('and the geoId is ca', () => {
			it('returns the correct Student Beans landing page URL', () => {
				const url = buildCheckoutUrl('ca', 'SupporterPlus', 'OneYearStudent');

				expect(url).toBe(routes.supporterPlusStudentBeansCa);
			});
		});
	});
});
