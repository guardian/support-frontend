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

const userCoreFields: TestFields = {
	email: email(),
	firstName: firstName(),
	lastName: lastName(),
	addresses: [],
};
const userDetails: Record<string, TestFields> = {
	UK: {
		...userCoreFields,
		addresses: [
			{
				postCode: 'N1 9GU',
				firstLine: '90 York Way',
				city: 'London',
			},
		],
	},
	EU: {
		...userCoreFields,
		addresses: [
			{
				postCode: '10117',
				firstLine: 'Pariser Platz',
				city: 'Berlin',
			},
		],
	},
	US: {
		...userCoreFields,
		addresses: [
			{
				postCode: '10006',
				state: 'New York',
				firstLine: '61 Broadway',
				city: 'New York',
			},
		],
	},
	CA: {
		...userCoreFields,
		addresses: [
			{
				postCode: 'ON M5V 3L9',
				state: 'Ontario',
				firstLine: '290 Bremner Blvd',
				city: 'Toronto',
			},
		],
	},
	AU: {
		...userCoreFields,
		addresses: [
			{
				postCode: '2010',
				state: 'New South Wales',
				firstLine: '19 Foster Street',
				city: 'Sydney',
			},
		],
	},
	NZ: {
		...userCoreFields,
		addresses: [
			{
				postCode: '1010',
				firstLine: 'Victoria Street West',
				city: 'Auckland',
			},
		],
	},
	INT: {
		...userCoreFields,
		addresses: [
			{
				postCode: '8001',
				firstLine: '0C Heerengracht Street',
				city: 'Cape Town',
			},
		],
	},
};

export const getUserFields = (
	country: string,
	postCode?: string,
): TestFields => {
	const validUserDetails = userDetails[country];
	if (!validUserDetails) {
		throw new Error(`No user details found for country: ${country}`);
	}
	if (postCode) {
		validUserDetails.addresses[0].postCode = postCode;
	}
	return validUserDetails;
};
