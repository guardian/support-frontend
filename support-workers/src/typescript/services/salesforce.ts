import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { z } from 'zod';
import { getAddressLine } from '../model/address';
import type { ProductTypeName } from '../model/productType';
import type { GiftRecipient, Title, User } from '../model/stateSchemas';
import type { SalesforceConfig } from './salesforceClient';
import { SalesforceClient } from './salesforceClient';

//RecordType field in salesforce to distinguish buyer contacts from recipient contacts.
//e.g. for contacts with more than print subscription, sent to different addresses. Has evolved to include gift recipient contacts.
export const salesforceDeliveryOrRecipientRecordTypeId = '01220000000VB50AAG';

//grouped properties for re-use in different contact record types
type BuyerIdentifierProps = {
	IdentityID__c: string;
	Email: string;
};
type MailingAddress = {
	MailingStreet: string | null;
	MailingCity: string | null;
	MailingState?: string | null; // optional because mandatory for US/CAN/AUS but not collected for UK/NZ
	MailingPostalCode?: string | null; // optional because mandatory for US/CAN/AUS/UK but optional for rest of world
	MailingCountry: string | null;
};
type BaseBillingAddress = {
	OtherState?: string | null; // optional because mandatory for US/CAN/AUS but not collected for UK/NZ
	OtherPostalCode?: string | null; //collected (optionally) for some countries, but not all
	OtherCountry: string | null;
};
type BillingAddress = BaseBillingAddress & {
	OtherStreet: string | null;
	OtherCity: string | null;
};

type GuardianWeeklyGiftRecipientOnlyProps = {
	Salutation?: Title | null;
	AccountId: string;
	Email?: string;
	RecordTypeId: typeof salesforceDeliveryOrRecipientRecordTypeId;
};
type GuardianWeeklyGiftBuyerOnlyProps = {
	Salutation?: Title | null;
	Phone?: string | null;
};

//ContactRecordRequest types
type BaseContactRecordRequest = {
	FirstName: string;
	LastName: string;
};

export type PrintContactRecordRequest = BaseContactRecordRequest &
	BillingAddress &
	MailingAddress &
	BuyerIdentifierProps;

type GuardianWeeklyGiftBuyerContactRecordRequest = BaseContactRecordRequest &
	BillingAddress &
	BuyerIdentifierProps &
	GuardianWeeklyGiftBuyerOnlyProps;

export type GuardianWeeklyGiftRecipientContactRecordRequest =
	BaseContactRecordRequest &
		MailingAddress &
		GuardianWeeklyGiftRecipientOnlyProps;

type DigitalOnlyContactRecordRequest = BaseContactRecordRequest &
	BuyerIdentifierProps &
	BaseBillingAddress;

type BuyerContactRecordRequest =
	| PrintContactRecordRequest
	| GuardianWeeklyGiftBuyerContactRecordRequest
	| DigitalOnlyContactRecordRequest;

type ContactRecordRequest =
	| BuyerContactRecordRequest
	| GuardianWeeklyGiftRecipientContactRecordRequest;

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
		productType: string,
	): Promise<SalesforceContactRecord> => {
		const hasGiftRecipient = !!giftRecipient;
		const buyerContact = createBuyerRecordRequest(
			user,
			giftRecipient,
			productType,
		);
		const buyerResponse = await this.upsert(buyerContact);

		if (
			hasGiftRecipient &&
			validGuardianWeeklyGiftRecipientFields(giftRecipient)
		) {
			const giftRecipientResponse =
				await this.createGuardianWeeklyGiftRecipientContact(
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

	private createGuardianWeeklyGiftRecipientContact(
		accountId: string,
		giftRecipient: GiftRecipient,
		user: User,
	): Promise<SuccessfulUpsertResponse> {
		const giftRecipientContact =
			createGuardianWeeklyGiftRecipientContactRecordRequest(
				accountId,
				giftRecipient,
				user,
			);
		return this.upsert(giftRecipientContact);
	}
}

export const validGuardianWeeklyGiftRecipientFields = (
	giftRecipient: GiftRecipient,
): boolean => {
	return !!giftRecipient.firstName && !!giftRecipient.lastName;
};

//potentially we could use something here that is more tightly bound to the product types in productType.ts
type ProductType =
	| 'Paper'
	| 'TierThree'
	| 'GuardianWeekly'
	| 'Contribution'
	| 'SupporterPlus'
	| 'DigitalPack'
	| 'GuardianAdLite';

export const createBuyerRecordRequest = (
	user: User,
	giftRecipient: GiftRecipient | null,
	productType: ProductTypeName,
): BuyerContactRecordRequest => {
	switch (productType) {
		case 'Paper':
		case 'TierThree':
		case 'GuardianWeekly':
			if (giftRecipient) {
				return createGuardianWeeklyGiftBuyerContactRecordRequest(user);
			}
			return createPrintContactRecordRequest(user);
		case 'Contribution':
		case 'SupporterPlus':
		case 'DigitalPack':
		case 'GuardianAdLite':
			return createDigitalOnlyContactRecordRequest(user);
	}
};

export const validDigitalOnlyContactFields = (user: User): boolean => {
	return !!user.billingAddress;
};
export const createDigitalOnlyContactRecordRequest = (
	user: User,
): DigitalOnlyContactRecordRequest => {
	if (!validDigitalOnlyContactFields(user)) {
		throw new Error('User must have a billing address');
	}
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

export const validGiftBuyerFields = (user: User): boolean => {
	return !!user.deliveryAddress && !!user.billingAddress;
};
export const createGuardianWeeklyGiftBuyerContactRecordRequest = (
	user: User,
): GuardianWeeklyGiftBuyerContactRecordRequest => {
	if (!validGiftBuyerFields(user)) {
		throw new Error('Gift buyer must have both billing and delivery addresses');
	}
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

export const createGuardianWeeklyGiftRecipientContactRecordRequest = (
	accountId: string,
	giftRecipient: GiftRecipient,
	user: User,
): GuardianWeeklyGiftRecipientContactRecordRequest => {
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

export const validPrintContactFields = (user: User): boolean => {
	return !!user.deliveryAddress && !!user.billingAddress;
};
export const createPrintContactRecordRequest = (
	user: User,
): PrintContactRecordRequest => {
	if (!validPrintContactFields(user)) {
		throw new Error(
			'Print contact must have both billing and delivery addresses',
		);
	}
	return {
		FirstName: user.firstName,
		LastName: user.lastName,
		Email: user.primaryEmailAddress,
		IdentityID__c: user.id,
		...createBillingAddressFields(user),
		...createMailingAddressFields(user),
	};
};
