import { IsoCountry } from '@modules/internationalisation/country';
import type { Title } from '../../../model/stateSchemas';

export const identityId = '9999999';

export const uk: IsoCountry = 'GB';

export const buyerTitle: Title = 'Mrs';
export const buyerFirstName = 'BuyerFirstName';
export const buyerLastName = 'BuyerLastName';
export const buyerEmailAddress = 'buyerEmail@example.com';
export const buyerTelephoneNumber = '0123456789';
export const buyerStreet = '1 Buyer Street';
export const buyerCity = 'Buyer City';
export const buyerState = 'Buyer State';
export const buyerPostCode = 'Buyer PostCode';

export const recipientTitle: Title = 'Ms';
export const recipientFirstName = 'RecipientFirstName';
export const recipientLastName = 'RecipientLastName';
export const recipientEmailAddress = 'recipientEmail@example.com';
export const recipientStreet = '1 Recipient Street';
export const recipientCity = 'Recipient City';
export const recipientState = 'Recipient State';
export const recipientPostCode = 'Recipient PostCode';

const buyerAddress = {
	lineOne: buyerStreet,
	city: buyerCity,
	state: buyerState,
	postCode: buyerPostCode,
	country: uk,
};

const recipientAddress = {
	lineOne: recipientStreet,
	city: recipientCity,
	state: recipientState,
	postCode: recipientPostCode,
	country: uk,
};

export const printSubscriber = {
	id: identityId,
	firstName: buyerFirstName,
	lastName: buyerLastName,
	title: buyerTitle,
	primaryEmailAddress: buyerEmailAddress,
	telephoneNumber: buyerTelephoneNumber,
	billingAddress: buyerAddress,
	deliveryAddress: buyerAddress,
	isTestUser: false,
};

//for gift buyer, billingAddress is that of the buyer, and deliveryAddress is that of the recipient
export const giftBuyer = {
	id: identityId,
	firstName: buyerFirstName,
	lastName: buyerLastName,
	title: buyerTitle,
	primaryEmailAddress: buyerEmailAddress,
	telephoneNumber: buyerTelephoneNumber,
	billingAddress: buyerAddress,
	deliveryAddress: recipientAddress,
	isTestUser: false,
};

export const giftRecipient = {
	firstName: recipientFirstName,
	lastName: recipientLastName,
	title: recipientTitle,
	email: recipientEmailAddress,
};

export const digitalOnlySubscriber = {
	id: identityId,
	primaryEmailAddress: buyerEmailAddress,
	title: buyerTitle,
	firstName: buyerFirstName,
	lastName: buyerLastName,
	billingAddress: {
		lineOne: null,
		lineTwo: null,
		city: null,
		state: null,
		postCode: null,
		country: uk,
	},
	deliveryAddress: null,
	telephoneNumber: null,
	isTestUser: false,
	deliveryInstructions: null,
};
