import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { z } from 'zod';
import { getAddressLine } from '../model/address';
import type { GiftRecipient, Title, User } from '../model/stateSchemas';
import type { SalesforceConfig } from './salesforceClient';
import { SalesforceClient } from './salesforceClient';

//RecordType field in salesforce to distinguish buyer contacts from recipient contacts.
//e.g. for contacts with more than print subscription, sent to different addresses. Has evolved to include gift recipient contacts.
const salesforceDeliveryOrRecipientRecordTypeId = '01220000000VB50AAG';

export type BaseContactRecordRequest = {
	Salutation?: Title | null;
	FirstName: string;
	LastName: string;
	Phone?: string | null;
};
export type DigitalOnlyContactRecordRequest = BaseContactRecordRequest & {
	Email: string;
	OtherState?: string | null;
	OtherPostalCode?: string | null;
	OtherCountry: string | null;
};
export type GiftBuyerContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	Email: string;
	OtherStreet: string | null;
	OtherCity: string | null;
	OtherState?: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
};
export type GiftRecipientContactRecordRequest = BaseContactRecordRequest & {
	AccountId: string;
	Email?: string;
	RecordTypeId: typeof salesforceDeliveryOrRecipientRecordTypeId;
	MailingStreet: string | null;
	MailingCity: string | null;
	MailingState?: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};
export type PrintContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	Email: string;
	OtherStreet: string | null;
	OtherCity: string | null;
	OtherState?: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
	MailingStreet: string | null;
	MailingCity: string | null;
	MailingState?: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};

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
		console.log('XXX user:', user);
		console.log('XXX giftRecipient:', giftRecipient);

		const hasGiftRecipient = !!giftRecipient;
		const buyerType = getBuyerType(user, hasGiftRecipient);
		console.log('XXX buyerType:', buyerType);
		const buyerContact = createBuyerRecordRequest(user, buyerType);
		console.log('XXX buyerContact:', buyerContact);

		const buyerResponse = await this.upsert(buyerContact);
		console.log('XXX buyerResponse:', buyerResponse);

		const giftRecipientResponse = await this.maybeAddGiftRecipient(
			buyerResponse.ContactRecord,
			giftRecipient,
			user,
		);
		console.log('XXX giftRecipientResponse:', giftRecipientResponse);

		const recipientContactRecord =
			giftRecipientResponse?.ContactRecord ?? buyerResponse.ContactRecord;

		return recipientContactRecord;
	};

	upsert = async (
		contact:
			| PrintContactRecordRequest
			| GiftBuyerContactRecordRequest
			| GiftRecipientContactRecordRequest
			| DigitalOnlyContactRecordRequest,
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

	private maybeAddGiftRecipient(
		contactRecord: SalesforceContactRecord,
		giftRecipient: GiftRecipient | null,
		user: User,
	): Promise<SuccessfulUpsertResponse> | null {
		if (giftRecipient && validGiftRecipientFields(giftRecipient)) {
			const giftRecipientContact = createGiftRecipientContactRecordRequest(
				contactRecord,
				giftRecipient,
				user,
			);
			return this.upsert(giftRecipientContact);
		}
		return null;
	}
}

export const validGiftRecipientFields = (
	giftRecipient: GiftRecipient,
): boolean => {
	return !!giftRecipient.firstName && !!giftRecipient.lastName;
};

export const createBuyerRecordRequest = (
	user: User,
	buyerType: 'Print' | 'GiftBuyer' | 'DigitalOnly',
):
	| PrintContactRecordRequest
	| GiftBuyerContactRecordRequest
	| DigitalOnlyContactRecordRequest => {
	console.log('Creating buyer record of type:', buyerType);

	switch (buyerType) {
		case 'Print':
			return createPrintContactRecordRequest(user);
		case 'GiftBuyer':
			return createGiftBuyerContactRecordRequest(user);
		case 'DigitalOnly': //todo see how tier three operates here
			return createDigitalOnlyContactRecordRequest(user);
	}
};

const getBuyerType = (
	user: User,
	hasGiftRecipient: boolean,
): 'Print' | 'GiftBuyer' | 'DigitalOnly' => {
	if (hasGiftRecipient) {
		return 'GiftBuyer';
	}

	if (buyerTypeIsPrint(hasGiftRecipient, user)) {
		return 'Print';
	}

	return 'DigitalOnly';
};

const buyerTypeIsPrint = (
	hasGiftRecipient: boolean | null,
	user: User,
): boolean => {
	return !hasGiftRecipient && !!user.deliveryAddress;
};

export const createDigitalOnlyContactRecordRequest = (
	user: User,
): DigitalOnlyContactRecordRequest => {
	return {
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
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
): GiftBuyerContactRecordRequest => {
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
	contactRecord: SalesforceContactRecord,
	giftRecipient: GiftRecipient,
	user: User,
): GiftRecipientContactRecordRequest => {
	return {
		AccountId: contactRecord.AccountId,
		Salutation: giftRecipient.title,
		FirstName: giftRecipient.firstName,
		LastName: giftRecipient.lastName,
		...(giftRecipient.email ? { Email: giftRecipient.email } : {}),
		RecordTypeId: salesforceDeliveryOrRecipientRecordTypeId,
		...createMailingAddressFields(user),
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
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
		Email: user.primaryEmailAddress,
		IdentityID__c: user.id,
		...createBillingAddressFields(user),
		...createMailingAddressFields(user),
	};
};
