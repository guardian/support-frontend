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

	describe('Digital products', () => {
		test('should build product information for Contribution', () => {
			const productFields = {
				productType: 'Contribution',
				amount: 50,
			} as ProductFields;

			const result = buildProductInformation({
				productFields: productFields,
				productKey: 'Contribution',
				ratePlanKey: 'Monthly',
				personalData: mockPersonalData,
				deliveryAddress: undefined,
				firstDeliveryDate: undefined,
				deliveryInstructions: '',
				deliveryAgent: undefined,
				giftRecipient: undefined,
			});

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

			const result = buildProductInformation({
				productFields: productFields,
				productKey: 'SupporterPlus',
				ratePlanKey: 'Annual',
				personalData: mockPersonalData,
				deliveryAddress: undefined,
				firstDeliveryDate: undefined,
				deliveryInstructions: '',
				deliveryAgent: undefined,
				giftRecipient: undefined,
			});

			expect(result).toEqual({
				product: 'SupporterPlus',
				ratePlan: 'Annual',
				amount: 100,
			});
		});

		test('should build product information for DigitalSubscription', () => {
			const productFields = {
				productType: 'DigitalPack',
			} as ProductFields;

			const result = buildProductInformation({
				productFields: productFields,
				productKey: 'DigitalSubscription',
				ratePlanKey: 'Monthly',
				personalData: mockPersonalData,
				deliveryAddress: undefined,
				firstDeliveryDate: undefined,
				deliveryInstructions: '',
				deliveryAgent: undefined,
				giftRecipient: undefined,
			});

			expect(result).toEqual({
				product: 'DigitalSubscription',
				ratePlan: 'Monthly',
			});
		});
	});

	describe('Delivery products', () => {
		test('should build product information for GuardianWeekly', () => {
			const productFields = {
				productType: 'GuardianWeekly',
			} as ProductFields;

			const result = buildProductInformation({
				productFields: productFields,
				productKey: 'GuardianWeeklyRestOfWorld',
				ratePlanKey: 'Quarterly',
				personalData: mockPersonalData,
				deliveryAddress: mockDeliveryAddress,
				firstDeliveryDate: '2024-06-15',
				deliveryInstructions: '',
				deliveryAgent: undefined,
				giftRecipient: undefined,
			});

			expect(result).toEqual({
				product: 'GuardianWeeklyRestOfWorld',
				ratePlan: 'Quarterly',
				firstDeliveryDate: new Date('2024-06-15'),
				deliveryContact: expectedDeliveryContact,
			});
		});

		test('should throw an error if delivery product missing delivery date', () => {
			const productFields = {
				productType: 'GuardianWeekly',
			} as ProductFields;

			expect(() =>
				buildProductInformation({
					productFields: productFields,
					productKey: 'GuardianWeeklyDomestic',
					ratePlanKey: 'Monthly',
					personalData: mockPersonalData,
					deliveryAddress: mockDeliveryAddress,
					firstDeliveryDate: undefined,
					deliveryInstructions: '',
					deliveryAgent: undefined,
					giftRecipient: undefined,
				}),
			).toThrow('Delivery products require a first delivery date');
		});

		test('should throw an error if delivery product is missing delivery address', () => {
			const productFields = {
				productType: 'GuardianWeekly',
			} as ProductFields;

			expect(() =>
				buildProductInformation({
					productFields: productFields,
					productKey: 'GuardianWeeklyDomestic',
					ratePlanKey: 'Monthly',
					personalData: mockPersonalData,
					deliveryAddress: undefined,
					firstDeliveryDate: '2024-06-15',
					deliveryInstructions: '',
					deliveryAgent: undefined,
					giftRecipient: undefined,
				}),
			).toThrow('Delivery products require a delivery address');
		});
	});

	describe('Newspaper products', () => {
		test('should build product information for newspaper with delivery instructions', () => {
			const productFields = {
				productType: 'Paper',
			} as ProductFields;

			const result = buildProductInformation({
				productFields: productFields,
				productKey: 'HomeDelivery',
				ratePlanKey: 'Everyday',
				personalData: mockPersonalData,
				deliveryAddress: mockDeliveryAddress,
				firstDeliveryDate: '2024-06-20',
				deliveryInstructions: 'Leave by front door',
				deliveryAgent: undefined,
				giftRecipient: undefined,
			});

			expect(result).toEqual({
				product: 'HomeDelivery',
				ratePlan: 'Everyday',
				firstDeliveryDate: new Date('2024-06-20'),
				deliveryContact: expectedDeliveryContact,
				deliveryInstructions: 'Leave by front door',
			});
		});
		test('should throw an error if newspaper product is missing delivery instructions', () => {
			const productFields = {
				productType: 'Paper',
			} as ProductFields;

			expect(() =>
				buildProductInformation({
					productFields: productFields,
					productKey: 'HomeDelivery',
					ratePlanKey: 'Everyday',
					personalData: mockPersonalData,
					deliveryAddress: mockDeliveryAddress,
					firstDeliveryDate: '2024-06-20',
					deliveryInstructions: undefined,
					deliveryAgent: undefined,
					giftRecipient: undefined,
				}),
			).toThrow(
				'Delivery instructions are required for Newspaper products, pass a blank string if necessary',
			);
		});

		test('should build product information for NationalDelivery with delivery agent', () => {
			const productFields = {
				productType: 'Paper',
			} as ProductFields;

			const result = buildProductInformation({
				productFields: productFields,
				productKey: 'NationalDelivery',
				ratePlanKey: 'Weekend',
				personalData: mockPersonalData,
				deliveryAddress: mockDeliveryAddress,
				firstDeliveryDate: '2024-06-22',
				deliveryInstructions: 'Ring doorbell twice',
				deliveryAgent: 123,
				giftRecipient: undefined,
			});

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

	describe('Gift subscriptions', () => {
		test('should use gift recipient details for delivery contact when giftRecipient is provided', () => {
			const productFields = {
				productType: 'GuardianWeekly',
			} as ProductFields;

			const giftRecipient = {
				firstName: 'Jane',
				lastName: 'Smith',
				email: 'jane.smith@example.com',
			};

			const result = buildProductInformation({
				productFields: productFields,
				productKey: 'GuardianWeeklyDomestic',
				ratePlanKey: 'OneYearGift',
				personalData: mockPersonalData,
				deliveryAddress: mockDeliveryAddress,
				firstDeliveryDate: '2024-12-25',
				deliveryInstructions: '',
				deliveryAgent: undefined,
				giftRecipient: giftRecipient,
			});

			expect(result).toEqual({
				product: 'GuardianWeeklyDomestic',
				ratePlan: 'OneYearGift',
				firstDeliveryDate: new Date('2024-12-25'),
				deliveryContact: {
					firstName: 'Jane',
					lastName: 'Smith',
					workEmail: 'jane.smith@example.com',
					country: 'GB',
					city: 'London',
					address1: '123 Main St',
					address2: 'Apt 4B',
					postalCode: 'SW1A 1AA',
				},
			});
		});
	});
});
