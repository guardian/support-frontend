import type { AddressFields } from './state';
import {
	applyBillingAddressRules,
	applyDeliveryAddressRules,
	isHomeDeliveryInM25,
	isPostcodeOptional,
	isStateNullable,
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

	it('returns an error if lineOne contains silly characters', () => {
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

	it('returns an error if lineTwo contains silly characters', () => {
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

	it('returns an error if city contains silly characters', () => {
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
		const fields = buildAddressFields({ country: '' });

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

	it('returns an error if postCode contains silly characters', () => {
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

		const errors = applyDeliveryAddressRules('HomeDelivery', fields);

		expect(errors).toEqual([
			{
				field: 'postCode',
				message:
					'The address and postcode you entered is outside of our delivery area. Please go back to purchase a voucher subscription instead.',
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

describe('isHomeDeliveryInM25 ', () => {
	it('returns true when the order is a home delivery and the postcode is within the M25', () => {
		const fulfilmentOption = 'HomeDelivery';
		const postcode = 'SE23 2AB';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isHomeDeliveryInM25(
			fulfilmentOption,
			postcode,
			homeDeliveryPostcodes,
		);

		expect(result).toBeTruthy();
	});

	it('returns false when the order is a home delivery and the postcode is outside the M25', () => {
		const fulfilmentOption = 'HomeDelivery';
		const postcode = 'DA11 7NP';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isHomeDeliveryInM25(
			fulfilmentOption,
			postcode,
			homeDeliveryPostcodes,
		);

		expect(result).toBeFalsy();
	});

	it('returns true when the fulfilment option is not home delivery', () => {
		const fulfilmentOption = 'Collection';
		const postcode = 'DA11 7NP';
		const homeDeliveryPostcodes = ['SE23'];

		const result = isHomeDeliveryInM25(
			fulfilmentOption,
			postcode,
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
	country = 'country',
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
