import buildCheckoutUrl from './buildCheckoutUrl';

describe('buildCheckoutUrl', () => {
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

	it('works with different geoId and ratePlanKey', () => {
		const result = buildCheckoutUrl('us', 'SupporterPlus', 'OneYearStudent');
		expect(result).toBe(
			'/us/checkout?product=SupporterPlus&ratePlan=OneYearStudent&backButton=false',
		);
	});
});
