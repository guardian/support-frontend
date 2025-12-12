import { email, firstName, lastName, userName } from './users';

export interface TestAddress {
	billingCountry?: string;
	postCode?: string;
	state?: string;
	firstLine?: string;
	city?: string;
}
export interface TestRecipient {
	firstName: string;
	lastName: string;
	email?: string;
}

export interface TestFields {
	email: string;
	firstName: string;
	lastName: string;
	recipient?: TestRecipient;
	addresses?: TestAddress[]; // 0st Delivery, 2nd Billing
}

const userCoreFields: TestFields = {
	email: email(),
	firstName: firstName(),
	lastName: lastName(),
	recipient: {
		firstName: userName('recipientFirstName'),
		lastName: userName('recipientLastName'),
		email: email(),
	},
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
			{
				postCode: 'M1 1PW',
				firstLine: '3 Cross Street',
				city: 'Manchester',
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
			{
				billingCountry: 'United Kingdom',
				postCode: 'N1 9GU',
				firstLine: '90 York Way',
				city: 'London',
			}, // Billing region differs from delivery
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
			{
				billingCountry: 'United States',
				postCode: '10006',
				state: 'New York',
				firstLine: '61 Broadway',
				city: 'New York',
			}, // Billing region differs from delivery
		],
	},
};

export const getUserFields = (
	country: string,
	postCode?: string,
): TestFields => {
	const validUserDetails = userDetails[country];
	const userDetailsCopy = structuredClone(validUserDetails); // Create a deep copy
	if (
		postCode &&
		userDetailsCopy.addresses &&
		userDetailsCopy.addresses.length > 0
	) {
		userDetailsCopy.addresses[0].postCode = postCode;
	}
	return userDetailsCopy;
};
