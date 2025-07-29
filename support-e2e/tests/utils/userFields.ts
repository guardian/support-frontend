import { email, firstName, lastName } from './users';

export interface TestAddress {
	postCode?: string;
	state?: string;
	firstLine?: string;
	city?: string;
}

export interface TestFields {
	email: string;
	firstName: string;
	lastName: string;
	addresses?: TestAddress[]; // 0st Delivery, 2nd Billing
}

type TestFieldsGenerator = () => TestFields;

export const ausWithFullAddress: TestFieldsGenerator = () => ({
	email: email(),
	firstName: firstName(),
	lastName: lastName(),
	addresses: [
		{
			postCode: '2010',
			state: 'New South Wales',
			firstLine: '19 Foster Street',
			city: 'Sydney',
		},
	],
});

export const ukWithPostalAddressOnly = (postCode: string = 'N1 9GU') => ({
	email: email(),
	firstName: firstName(),
	lastName: lastName(),
	addresses: [
		{
			postCode: postCode,
			firstLine: '90 York Way',
			city: 'London',
		},
	],
});

export const intWithPostalAddressOnly = (postCode: string = '8001') => ({
	email: email(),
	firstName: firstName(),
	lastName: lastName(),
	addresses: [
		{
			postCode: postCode,
			firstLine: '0C Heerengracht Street',
			city: 'Cape Town',
		},
	],
});

export const usWithPostalAddressOnly: TestFieldsGenerator = () => ({
	email: email(),
	firstName: firstName(),
	lastName: lastName(),
	addresses: [
		{
			postCode: '10006',
			state: 'New York',
			firstLine: '61 Broadway',
			city: 'New York',
		},
	],
});
