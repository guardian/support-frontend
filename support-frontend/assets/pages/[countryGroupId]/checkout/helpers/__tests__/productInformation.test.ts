import type { ProductFields } from '../../../../../helpers/forms/paymentIntegrations/readerRevenueApis';
import type { FormAddress, FormPersonalFields } from '../formDataExtractors';
import { buildProductInformation } from '../productInformation';

describe('buildProductInformation', () => {
	const mockPersonalData: FormPersonalFields = {
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
	};

	const mockDeliveryAddress: FormAddress = {
		country: 'GB',
		city: 'London',
		lineOne: '123 Main St',
		lineTwo: 'Apt 4B',
		postCode: 'SW1A 1AA',
	};

	const expectedDeliveryContact = {
		firstName: 'John',
		lastName: 'Doe',
		workEmail: 'john.doe@example.com',
		country: 'GB',
		city: 'London',
		address1: '123 Main St',
		address2: 'Apt 4B',
		postalCode: 'SW1A 1AA',
	};

	describe('Contribution products', () => {
		test('should build product information for Contribution', () => {
			const productFields = {
				productType: 'Contribution',
				amount: 50,
			} as ProductFields;

			const result = buildProductInformation(
				productFields,
				'Contribution',
				'Monthly',
				mockPersonalData,
				undefined,
				null,
				'',
				undefined,
			);

			expect(result).toEqual({
				product: 'Contribution',
				ratePlan: 'Monthly',
				amount: 50,
			});
		});

		test('should build product information for SupporterPlus', () => {
			const productFields = {
				productType: 'SupporterPlus',
				amount: 100,
			} as ProductFields;

			const result = buildProductInformation(
				productFields,
				'SupporterPlus',
				'Annual',
				mockPersonalData,
				undefined,
				null,
				'',
				undefined,
			);

			expect(result).toEqual({
				product: 'SupporterPlus',
				ratePlan: 'Annual',
				amount: 100,
			});
		});
	});

	describe('Delivery products', () => {
		test('should build product information for GuardianWeekly', () => {
			const productFields = {
				productType: 'GuardianWeekly',
			} as ProductFields;

			const result = buildProductInformation(
				productFields,
				'GuardianWeeklyRestOfWorld',
				'Quarterly',
				mockPersonalData,
				mockDeliveryAddress,
				'2024-06-15',
				'',
				undefined,
			);

			expect(result).toEqual({
				product: 'GuardianWeeklyRestOfWorld',
				ratePlan: 'Quarterly',
				firstDeliveryDate: new Date('2024-06-15'),
				deliveryContact: expectedDeliveryContact,
			});
		});

		test('should throw error when delivery product missing delivery date', () => {
			const productFields = {
				productType: 'GuardianWeekly',
			} as ProductFields;

			expect(() =>
				buildProductInformation(
					productFields,
					'GuardianWeeklyDomestic',
					'Monthly',
					mockPersonalData,
					mockDeliveryAddress,
					null,
					'',
					undefined,
				),
			).toThrow('Delivery products require a first delivery date');
		});

		test('should throw error when delivery product missing delivery address', () => {
			const productFields = {
				productType: 'GuardianWeekly',
			} as ProductFields;

			expect(() =>
				buildProductInformation(
					productFields,
					'GuardianWeeklyDomestic',
					'Monthly',
					mockPersonalData,
					undefined,
					'2024-06-15',
					'',
					undefined,
				),
			).toThrow('Delivery products require a delivery address');
		});
	});

	describe('Newspaper products', () => {
		test('should build product information for newspaper with delivery instructions', () => {
			const productFields = {
				productType: 'Paper',
			} as ProductFields;

			const result = buildProductInformation(
				productFields,
				'HomeDelivery',
				'Everyday',
				mockPersonalData,
				mockDeliveryAddress,
				'2024-06-20',
				'Leave by front door',
				undefined,
			);

			expect(result).toEqual({
				product: 'HomeDelivery',
				ratePlan: 'Everyday',
				firstDeliveryDate: new Date('2024-06-20'),
				deliveryContact: expectedDeliveryContact,
				deliveryInstructions: 'Leave by front door',
			});
		});
	});

	describe('NationalDelivery products', () => {
		test('should build product information for NationalDelivery with delivery agent', () => {
			const productFields = {
				productType: 'Paper',
			} as ProductFields;

			const result = buildProductInformation(
				productFields,
				'NationalDelivery',
				'Weekend',
				mockPersonalData,
				mockDeliveryAddress,
				'2024-06-22',
				'Ring doorbell twice',
				123,
			);

			expect(result).toEqual({
				product: 'NationalDelivery',
				ratePlan: 'Weekend',
				firstDeliveryDate: new Date('2024-06-22'),
				deliveryContact: expectedDeliveryContact,
				deliveryInstructions: 'Ring doorbell twice',
				deliveryAgent: 123,
			});
		});
	});

	describe('Digital products', () => {
		test('should build product information for DigitalSubscription', () => {
			const productFields = {
				productType: 'DigitalPack',
			} as ProductFields;

			const result = buildProductInformation(
				productFields,
				'DigitalSubscription',
				'Monthly',
				mockPersonalData,
				undefined,
				null,
				'',
				undefined,
			);

			expect(result).toEqual({
				product: 'DigitalSubscription',
				ratePlan: 'Monthly',
			});
		});
	});
});
