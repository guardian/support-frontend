import prod from '@guardian/support-service-lambdas/modules/zuora-catalog/test/fixtures/catalog-prod.json';
import { generateProductCatalog } from '@modules/product-catalog/generateProductCatalog';
import { getChargeOverride } from '../lambdas/createZuoraSubscriptionTSLambda';
import { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';

jest.mock('../model/stage', () => ({
	stageFromEnvironment: jest.fn().mockReturnValue('CODE'),
}));

describe('getChargeOverride', () => {
	const productCatalog = generateProductCatalog(prod);
	const chargeOverrideShouldBeUndefinedForProduct = (
		productInformation: ProductPurchase,
	) => {
		expect(
			getChargeOverride(productCatalog, productInformation),
		).toBeUndefined();
	};

	test('should return the correct charge override for a Contribution', () => {
		expect(
			getChargeOverride(productCatalog, {
				product: 'Contribution',
				ratePlan: 'Annual',
				amount: 150,
			}),
		).toEqual({
			productRatePlanChargeId: '2c92a0fc5e1dc084015e37f58c7b0f34',
			overrideAmount: 150,
		});

		expect(
			getChargeOverride(productCatalog, {
				product: 'Contribution',
				ratePlan: 'Monthly',
				amount: 15,
			}),
		).toEqual({
			productRatePlanChargeId: '2c92a0fc5aacfadd015ad250bf2c6d38',
			overrideAmount: 15,
		});
	});
	test('should return a charge override for SupporterPlus rate plans which have a contribution charge', () => {
		expect(
			getChargeOverride(productCatalog, {
				product: 'SupporterPlus',
				ratePlan: 'Monthly',
				amount: 15,
			}),
		).toEqual({
			productRatePlanChargeId: '8a128d7085fc6dec01860234cd075270',
			overrideAmount: 15,
		});

		expect(
			getChargeOverride(productCatalog, {
				product: 'SupporterPlus',
				ratePlan: 'Annual',
				amount: 150,
			}),
		).toEqual({
			productRatePlanChargeId: '8a12892d85fc6df4018602451322287f',
			overrideAmount: 150,
		});
	});
	test('should not return a charge override for SupporterPlus rate plans which do not have a contribution charge', () => {
		chargeOverrideShouldBeUndefinedForProduct({
			product: 'SupporterPlus',
			ratePlan: 'OneYearStudent',
			amount: 150,
		});
	});
	test('should not return a charge override for products which do not have an amount in the product information', () => {
		chargeOverrideShouldBeUndefinedForProduct({
			product: 'NewspaperVoucher',
			ratePlan: 'EverydayPlus',
		});
		chargeOverrideShouldBeUndefinedForProduct({
			product: 'GuardianWeeklyRestOfWorld',
			ratePlan: 'Annual',
		});
		chargeOverrideShouldBeUndefinedForProduct({
			product: 'TierThree',
			ratePlan: 'DomesticAnnual',
		});
		chargeOverrideShouldBeUndefinedForProduct({
			product: 'GuardianAdLite',
			ratePlan: 'Monthly',
		});
		chargeOverrideShouldBeUndefinedForProduct({
			product: 'DigitalSubscription',
			ratePlan: 'Monthly',
		});
	});
});
