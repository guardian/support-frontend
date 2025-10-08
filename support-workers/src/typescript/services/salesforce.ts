import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { z } from 'zod';
import { getAddressLine } from '../model/address';
import type { GiftRecipient, Title, User } from '../model/stateSchemas';
import type { SalesforceConfig } from './salesforceClient';
import { SalesforceClient } from './salesforceClient';

//RecordType field in salesforce to distinguish buyer contacts from recipient contacts.
//e.g. for contacts with more than print subscription, sent to different addresses. Has evolved to include gift recipient contacts.
export const salesforceDeliveryOrRecipientRecordTypeId = '01220000000VB50AAG';

export type RecipientMailingAddress = {
	MailingStreet: string | null;
	MailingCity: string | null;
	MailingState?: string | null; // optional because mandatory for US/CAN/AUS but not collected for UK/NZ
	MailingPostalCode?: string | null; // optional because mandatory for US/CAN/AUS/UK but optional for rest of world
	MailingCountry: string | null;
};
export type BuyerBillingAddress = BaseBillingAddress & {
	OtherStreet: string | null;
	OtherCity: string | null;
};

export type BaseContactRecordRequest = {
	FirstName: string;
	LastName: string;
};
export type BaseBillingAddress = {
	OtherState?: string | null; // optional because mandatory for US/CAN/AUS but not collected for UK/NZ
	OtherPostalCode?: string | null; //collected (optionally) for some countries, but not all
	OtherCountry: string | null;
};

export type BuyerIdentifierProps = {
	IdentityID__c: string;
	Email: string;
};
//how to differentiate between printGiftBuyer and printAndDigitalBuyer
export type PrintContactRecordRequest = BaseContactRecordRequest &
	RecipientMailingAddress &
	BuyerBillingAddress &
	BuyerIdentifierProps;

export type GiftOnlyProps = {
	Salutation?: Title | null;
};
export type PrintGiftBuyerContactRecordRequest = BaseContactRecordRequest &
	BuyerBillingAddress &
	BuyerIdentifierProps &
	GiftOnlyProps & {
		Phone?: string | null;
	};
export type PrintGiftRecipientContactRecordRequest = BaseContactRecordRequest &
	RecipientMailingAddress &
	GiftOnlyProps & {
		AccountId: string;
		Email?: string;
		RecordTypeId: typeof salesforceDeliveryOrRecipientRecordTypeId;
	};

export type DigitalOnlyContactRecordRequest = BaseContactRecordRequest &
	BuyerIdentifierProps &
	BaseBillingAddress;

export type PrintAndDigitalBuyerContactRecordRequest =
	BaseContactRecordRequest &
		RecipientMailingAddress &
		BuyerBillingAddress &
		BuyerIdentifierProps;

type BuyerType = 'Print' | 'GiftBuyer' | 'DigitalOnly';
type BuyerTypeRecordRequest =
	| PrintContactRecordRequest
	| PrintGiftBuyerContactRecordRequest
	| DigitalOnlyContactRecordRequest;
type ContactRecordRequest =
	| BuyerTypeRecordRequest
	| PrintGiftRecipientContactRecordRequest;

export const salesforceContactRecordSchema = z.object({
	Id: z.string(),
	AccountId: z.string(),
});
export type SalesforceContactRecord = z.infer<
	typeof salesforceContactRecordSchema
>;

export class SalesforceError extends Error {
	constructor({ errorCode, message }: { errorCode: string; message: string }) {
		super(message);
		this.name = errorCode;
	}
}

export const successfulUpsertResponseSchema = z.object({
	Success: z.literal(true),
	ContactRecord: salesforceContactRecordSchema,
});

type SuccessfulUpsertResponse = z.infer<typeof successfulUpsertResponseSchema>;

const failedUpsertResponseSchema = z.object({
	Success: z.literal(false),
	ErrorString: z.string(),
});
const upsertResponseSchema = z.discriminatedUnion('Success', [
	successfulUpsertResponseSchema,
	failedUpsertResponseSchema,
]);

export type UpsertResponse = z.infer<typeof upsertResponseSchema>;

export const salesforceErrorCodes = {
	expiredAuthenticationCode: 'INVALID_SESSION_ID',
	rateLimitExceeded: 'REQUEST_LIMIT_EXCEEDED',
	readOnlyMaintenance: 'INSERT_UPDATE_DELETE_NOT_ALLOWED_DURING_MAINTENANCE',
};

export class SalesforceService {
	private upsertEndpoint = 'services/apexrest/RegisterCustomer/v1/';
	private client: SalesforceClient;

	constructor(config: SalesforceConfig) {
		this.client = new SalesforceClient(config);
	}

	createContactRecords = async (
		user: User,
		giftRecipient: GiftRecipient | null,
	): Promise<SalesforceContactRecord> => {
		const hasGiftRecipient = !!giftRecipient;
		const buyerType = getBuyerType(user, hasGiftRecipient);
		const buyerContact = createBuyerRecordRequest(user, buyerType);
		const buyerResponse = await this.upsert(buyerContact);

		if (hasGiftRecipient && validGiftRecipientFields(giftRecipient)) {
			const giftRecipientResponse = await this.addGiftRecipient(
				buyerResponse.ContactRecord.AccountId,
				giftRecipient,
				user,
			);
			return giftRecipientResponse.ContactRecord;
		}

		return buyerResponse.ContactRecord;
	};

	upsert = async (
		contact: ContactRecordRequest,
	): Promise<SuccessfulUpsertResponse> => {
		const response: UpsertResponse = await this.client.post(
			this.upsertEndpoint,
			JSON.stringify({
				newContact: contact,
			}),
			upsertResponseSchema,
		);

		return SalesforceService.parseResponseToResult(response);
	};

	static parseResponseToResult(response: UpsertResponse) {
		if (response.Success) {
			return response;
		} else {
			const errorCode = response.ErrorString.includes(
				salesforceErrorCodes.readOnlyMaintenance,
			)
				? salesforceErrorCodes.readOnlyMaintenance
				: 'UNKNOWN_ERROR';
			throw new SalesforceError({
				errorCode,
				message:
					response.ErrorString ||
					'Salesforce `Success` returned as `false` with no error message',
			});
		}
	}

	private addGiftRecipient(
		accountId: string,
		giftRecipient: GiftRecipient,
		user: User,
	): Promise<SuccessfulUpsertResponse> {
		const giftRecipientContact = createGiftRecipientContactRecordRequest(
			accountId,
			giftRecipient,
			user,
		);
		return this.upsert(giftRecipientContact);
	}
}

export const validGiftRecipientFields = (
	giftRecipient: GiftRecipient,
): boolean => {
	return !!giftRecipient.firstName && !!giftRecipient.lastName;
};

export const createBuyerRecordRequest = (
	user: User,
	buyerType: BuyerType,
): BuyerTypeRecordRequest => {
	switch (buyerType) {
		case 'Print':
			return createPrintContactRecordRequest(user);
		case 'GiftBuyer':
			return createGiftBuyerContactRecordRequest(user);
		case 'DigitalOnly':
			return createDigitalOnlyContactRecordRequest(user);
	}
};

const getBuyerType = (user: User, hasGiftRecipient: boolean): BuyerType => {
	if (buyerTypeIsGiftBuyer(user, hasGiftRecipient)) {
		return 'GiftBuyer';
	}

	if (buyerTypeIsPrint(hasGiftRecipient, user)) {
		return 'Print';
	}

	if (buyerTypeIsDigitalOnly(user)) {
		return 'DigitalOnly';
	}

	return 'DigitalOnly';
};

export const buyerTypeIsGiftBuyer = (
	user: User,
	hasGiftRecipient: boolean,
): boolean => {
	return hasGiftRecipient && !!user.deliveryAddress && !!user.billingAddress;
};

export const buyerTypeIsDigitalOnly = (user: User): boolean => {
	return !user.deliveryAddress && !!user.billingAddress;
};

export const buyerTypeIsPrint = (
	hasGiftRecipient: boolean | null,
	user: User,
): boolean => {
	return !hasGiftRecipient && !!user.deliveryAddress && !!user.billingAddress;
};

export const createDigitalOnlyContactRecordRequest = (
	user: User,
): DigitalOnlyContactRecordRequest => {
	return {
		IdentityID__c: user.id,
		Email: user.primaryEmailAddress,
		FirstName: user.firstName,
		LastName: user.lastName,
		OtherCountry: getCountryNameByIsoCode(user.billingAddress.country),
		...(user.billingAddress.state
			? { OtherState: user.billingAddress.state }
			: {}),
		...(user.billingAddress.postCode
			? { OtherPostalCode: user.billingAddress.postCode }
			: {}),
	};
};

export const createGiftBuyerContactRecordRequest = (
	user: User,
): PrintGiftBuyerContactRecordRequest => {
	return {
		IdentityID__c: user.id,
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
		...createBillingAddressFields(user),
	};
};

export const createGiftRecipientContactRecordRequest = (
	accountId: string,
	giftRecipient: GiftRecipient,
	user: User,
): PrintGiftRecipientContactRecordRequest => {
	return {
		AccountId: accountId,
		Salutation: giftRecipient.title,
		FirstName: giftRecipient.firstName,
		LastName: giftRecipient.lastName,
		...(giftRecipient.email ? { Email: giftRecipient.email } : {}),
		RecordTypeId: salesforceDeliveryOrRecipientRecordTypeId,
		...createMailingAddressFields(user), //gift recipient address is the deliveryAddress on the user object
	};
};

export const createMailingAddressFields = (user: User) => {
	return {
		MailingStreet: user.deliveryAddress
			? getAddressLine(user.deliveryAddress)
			: null,
		MailingCity: user.deliveryAddress?.city ?? null,
		MailingState: user.deliveryAddress?.state ?? null,
		MailingPostalCode: user.deliveryAddress?.postCode ?? null,
		MailingCountry: user.deliveryAddress?.country
			? getCountryNameByIsoCode(user.deliveryAddress.country)
			: null,
	};
};

export const createBillingAddressFields = (user: User) => {
	return {
		OtherStreet: getAddressLine(user.billingAddress),
		OtherCity: user.billingAddress.city,
		OtherState: user.billingAddress.state ?? null,
		OtherPostalCode: user.billingAddress.postCode ?? null,
		OtherCountry: getCountryNameByIsoCode(user.billingAddress.country),
	};
};

export const createPrintContactRecordRequest = (
	user: User,
): PrintContactRecordRequest => {
	return {
		FirstName: user.firstName,
		LastName: user.lastName,
		Email: user.primaryEmailAddress,
		IdentityID__c: user.id,
		...createBillingAddressFields(user),
		...createMailingAddressFields(user),
	};
};
