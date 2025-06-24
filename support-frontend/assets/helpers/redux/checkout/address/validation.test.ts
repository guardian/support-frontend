import type { IsoCountry } from '@modules/internationalisation/country';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { AddressFields } from './state';
import {
	applyBillingAddressRules,
	applyDeliveryAddressRules,
	isHomeDeliveryAvailable,
	isPostcodeOptional,
	isSaturdayOrSundayDeliveryAvailable,
	isStateNullable,
	isValidPostcodeForHomeDelivery,
} from './validation';

describe('applyBillingAddressRules', () => {
	it('returns an error if lineOne is empty', () => {
		const fields = buildAddressFields({ lineOne: '' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'lineOne',
				message: 'Please enter a billing address.',
			},
		]);
	});

	it('returns an error if lineOne is longer than 100 chars', () => {
		const fields = buildAddressFields({ lineOne: 'A'.repeat(101) });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'lineOne',
				message: 'Value cannot be longer than 100 characters.',
			},
		]);
	});

	it('returns an error if lineOne contains non-zuora-compatible characters', () => {
		const fields = buildAddressFields({ lineOne: '🏡' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'lineOne',
				message: 'Please use only letters, numbers and punctuation.',
			},
		]);
	});

	it('returns an error if lineTwo is longer than 100 characters', () => {
		const fields = buildAddressFields({ lineTwo: 'A'.repeat(101) });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'lineTwo',
				message: 'Value cannot be longer than 100 characters.',
			},
		]);
	});

	it('returns an error if lineTwo contains non-zuora-compatible characters', () => {
		const fields = buildAddressFields({ lineTwo: '🏡' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'lineTwo',
				message: 'Please use only letters, numbers and punctuation.',
			},
		]);
	});

	it('returns an error if city is empty', () => {
		const fields = buildAddressFields({ city: '' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'city',
				message: 'Please enter a billing city.',
			},
		]);
	});

	it('returns an error if city contains non-zuora-compatible characters', () => {
		const fields = buildAddressFields({ city: '🏡' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'city',
				message: 'Please use only letters, numbers and punctuation.',
			},
		]);
	});

	it('returns an error if state is required and is empty', () => {
		const fields = buildAddressFields({ state: '', country: 'US' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'state',
				message: 'Please select a billing state.',
			},
		]);
	});

	it('returns an error if state is longer than 40 characters', () => {
		const fields = buildAddressFields({ state: 'A'.repeat(41) });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'state',
				message:
					'Please enter a billing state name no longer than 40 characters',
			},
		]);
	});

	it('returns an error if country is empty', () => {
		const fields = buildAddressFields({ country: '' as IsoCountry });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'country',
				message: 'Please select a billing country.',
			},
		]);
	});

	it('returns an error if postCode is required and is empty', () => {
		const fields = buildAddressFields({ postCode: '', country: 'GB' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'postCode',
				message: 'Please enter a billing postcode.',
			},
		]);
	});

	it('returns an error if postCode is longer than 20 characters', () => {
		const fields = buildAddressFields({ postCode: 'A'.repeat(21) });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'postCode',
				message:
					'Please enter a billing postcode no longer than 20 characters.',
			},
		]);
	});

	it('returns an error if postCode contains non-zuora-compatible characters', () => {
		const fields = buildAddressFields({ postCode: '🏡' });

		const errors = applyBillingAddressRules(fields);

		expect(errors).toEqual([
			{
				field: 'postCode',
				message: 'Please use only letters, numbers and punctuation.',
			},
		]);
	});
});

describe('applyDeliveryAddressRules', () => {
	// For brevity, we only test the address specific rules. All of the rules that
	// are applied to billing addresses are also applied to delivery addresses.
	it('returns an error if postCode is outside of the M25', () => {
		const fields = buildAddressFields({ postCode: 'DA11 7NP' });

		const errors = applyDeliveryAddressRules(
			'HomeDelivery',
			fields,
			{ isLoading: false },
			'Everyday',
		);

		expect(errors).toEqual([
			{
				field: 'postCode',
				message:
					'The postcode you entered is outside of our delivery area. Please go back to purchase a subscription card instead.',
			},
		]);
	});
});

describe('isPostcodeOptional', () => {
	it('returns false for GB, AU, US, and CA', () => {
		expect(isPostcodeOptional('GB')).toBeFalsy();
		expect(isPostcodeOptional('AU')).toBeFalsy();
		expect(isPostcodeOptional('US')).toBeFalsy();
		expect(isPostcodeOptional('CA')).toBeFalsy();
	});

	it('returns true for other countries', () => {
		expect(isPostcodeOptional('HK')).toBeTruthy();
	});
});

describe('isStateNullable', () => {
	it('returns false for AU, US, and CA', () => {
		expect(isStateNullable('AU')).toBeFalsy();
		expect(isStateNullable('US')).toBeFalsy();
		expect(isStateNullable('CA')).toBeFalsy();
	});

	it('returns true for other countries', () => {
		expect(isStateNullable('GB')).toBeTruthy();
		expect(isStateNullable('HK')).toBeTruthy();
	});
});

describe('isValidPostcodeForHomeDelivery', () => {
	it('returns true when not a home delivery', () => {
		const fulfilmentOption = 'Collection';
		const postcode = 'DA11 7NP';

		const result = isValidPostcodeForHomeDelivery(fulfilmentOption, postcode);

		expect(result).toBeTruthy();
	});

	it('returns true when valid UK postcode', () => {
		const fulfilmentOption = 'HomeDelivery';
		const postcode = 'DA11 7NP';

		const result = isValidPostcodeForHomeDelivery(fulfilmentOption, postcode);

		expect(result).toBeTruthy();
	});

	it('returns false when invalid UK postcode', () => {
		const fulfilmentOption = 'HomeDelivery';
		const postcode = 'DA11 7NP ';

		const result = isValidPostcodeForHomeDelivery(fulfilmentOption, postcode);

		expect(result).toBeFalsy();
	});
});

describe('isHomeDeliveryAvailable', () => {
	it('returns true when the order is a home delivery and the postcode is outside the M25 and a delivery agent is available', () => {
		const fulfilmentOption = 'HomeDelivery';
		const postcode = 'DE 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isHomeDeliveryAvailable(
			fulfilmentOption,
			postcode,
			{
				isLoading: false,
				response: {
					type: 'Covered',
					agents: [
						{
							agentId: 1,
							agentName: 'Delivery Company',
							deliveryMethod: 'Car',
							nbrDeliveryDays: 7,
							postcode: '',
							refGroupId: 1,
							summary: '',
						},
					],
				},
			},
			homeDeliveryPostcodes,
		);

		expect(result).toBeTruthy();
	});

	it('returns true when the order is a home delivery and the postcode is inside the M25', () => {
		const fulfilmentOption = 'HomeDelivery';
		const postcode = 'SE23 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isHomeDeliveryAvailable(
			fulfilmentOption,
			postcode,
			{
				isLoading: false,
			},
			homeDeliveryPostcodes,
		);

		expect(result).toBeTruthy();
	});

	it('returns false when the order is a home delivery and the postcode is outside the M25 and a delivery agent is NOT available', () => {
		const fulfilmentOption = 'HomeDelivery';
		const postcode = 'DE 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isHomeDeliveryAvailable(
			fulfilmentOption,
			postcode,
			{
				isLoading: false,
				response: {
					type: 'Covered',
					agents: [],
				},
			},
			homeDeliveryPostcodes,
		);

		expect(result).toBeFalsy();
	});

	it('returns true when the fulfilment option is not home delivery', () => {
		const fulfilmentOption = 'Collection';
		const postcode = 'DA11 7NP';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isHomeDeliveryAvailable(
			fulfilmentOption,
			postcode,
			{
				isLoading: false,
				response: {
					type: 'Covered',
					agents: [],
				},
			},
			homeDeliveryPostcodes,
		);

		expect(result).toBeTruthy();
	});
});

describe('isSaturdayOrSundayDeliveryAvailable', () => {
	it('returns true if postcode inside area', () => {
		const fulfilmentOption = 'HomeDelivery';
		const productOption = 'Sunday';
		const postcode = 'SE23 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isSaturdayOrSundayDeliveryAvailable(
			fulfilmentOption,
			postcode,
			productOption,
			homeDeliveryPostcodes,
		);

		expect(result).toBeTruthy();
	});

	it('returns false if postcode outside area', () => {
		const fulfilmentOption = 'HomeDelivery';
		const productOption = 'Sunday';
		const postcode = 'DE 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isSaturdayOrSundayDeliveryAvailable(
			fulfilmentOption,
			postcode,
			productOption,
			homeDeliveryPostcodes,
		);

		expect(result).toBeFalsy();
	});

	it('returns true if not Sunday or Saturday product', () => {
		const fulfilmentOption = 'HomeDelivery';
		const productOption = 'Everyday';
		const postcode = 'DE 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isSaturdayOrSundayDeliveryAvailable(
			fulfilmentOption,
			postcode,
			productOption,
			homeDeliveryPostcodes,
		);

		expect(result).toBeTruthy();
	});

	it('returns true if not HomeDelivery fulfilment option', () => {
		const fulfilmentOption: FulfilmentOptions = 'Collection';
		const productOption = 'Sunday';
		const postcode = 'DE 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isSaturdayOrSundayDeliveryAvailable(
			fulfilmentOption,
			postcode,
			productOption,
			homeDeliveryPostcodes,
		);

		expect(result).toBeTruthy();
	});
});

// ---- Helpers ---- //

function buildAddressFields({
	lineOne = 'line one',
	lineTwo = 'line two',
	city = 'city',
	state = 'state',
	country = 'IE',
	postCode = 'postcode',
}: Partial<AddressFields>): AddressFields {
	return {
		lineOne,
		lineTwo,
		city,
		state,
		country,
		postCode,
	};
}
