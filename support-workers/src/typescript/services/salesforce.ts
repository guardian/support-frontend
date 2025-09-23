import { getCountryNameByIsoCode } from '@modules/internationalisation/country';
import { z } from 'zod';
import { getAddressLine } from '../model/address';
import type { GiftRecipient, Title, User } from '../model/stateSchemas';
import type { SalesforceConfig } from './salesforceClient';
import { SalesforceClient } from './salesforceClient';

export type BaseContactRecordRequest = {
	Salutation?: Title | null;
	FirstName: string;
	LastName: string;
	Email: string | null; //wouldn't collect for giftee
	Phone?: string | null; //wouldn't collect for digital, and potentially not for giftee
};
//buyer always has a billing address. Billing fields on buyer might be optional (e.g. street, city city, postcode)
export type StandardContactRecordRequest = BaseContactRecordRequest & {
	IdentityID__c: string;
	//should have email sitting with Identity Id
	OtherStreet: string | undefined;
	OtherCity: string | null;
	OtherState: string | null;
	OtherPostalCode: string | null;
	OtherCountry: string | null;
	MailingStreet: string | undefined;
	MailingCity: string | null;
	MailingState: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};

export type DeliveryContactRecordRequest = BaseContactRecordRequest & {
	AccountId: string;
	RecordTypeId: '01220000000VB50AAG';
	MailingStreet: string | undefined;
	MailingCity: string | null;
	MailingState: string | null;
	MailingPostalCode: string | null;
	MailingCountry: string | null;
};

export type DigitalOnlyContactRecordRequest = BaseContactRecordRequest & {
	RecordTypeId: '01220000000VB50AAG';
	MailingState?: string | null;
	MailingCountry?: string | null;
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
		const buyerResponse = await this.upsert(
			createContactRecordRequest(user, giftRecipient),
		);
		const giftRecipientResponse = await this.maybeAddGiftRecipient(
			buyerResponse.ContactRecord,
			giftRecipient,
			user,
		);
		return giftRecipientResponse?.ContactRecord ?? buyerResponse.ContactRecord;
	};

	upsert = async (
		contact:
			| StandardContactRecordRequest
			| DeliveryContactRecordRequest
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
		if (giftRecipient?.firstName && giftRecipient.lastName) {
			const giftRecipientContact: DeliveryContactRecordRequest = {
				AccountId: contactRecord.AccountId,
				Email: giftRecipient.email,
				Salutation: giftRecipient.title,
				FirstName: giftRecipient.firstName,
				LastName: giftRecipient.lastName,
				MailingStreet: user.deliveryAddress
					? getAddressLine(user.deliveryAddress)
					: null,
				MailingCity: user.deliveryAddress?.city ?? null,
				MailingState: user.deliveryAddress?.state ?? null,
				MailingPostalCode: user.deliveryAddress?.postCode ?? null,
				MailingCountry: user.deliveryAddress
					? getCountryNameByIsoCode(user.deliveryAddress.country)
					: null,
				RecordTypeId: '01220000000VB50AAG',
			};
			return this.upsert(giftRecipientContact);
		}
		return null;
	}
}

const createStandardContactRecordRequest = (
	user: User,
): StandardContactRecordRequest => {
	return {
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
		IdentityID__c: user.id,
		...createBillingAddressFields(user),
		...createMailingAddressFields(user),
	};
};

const createDeliveryContactRecordRequest = (
	contactRecord: SalesforceContactRecord,
	giftRecipient: GiftRecipient,
	user: User,
): DeliveryContactRecordRequest => {
	return {
		AccountId: contactRecord.AccountId,
		Email: giftRecipient.email,
		Salutation: giftRecipient.title,
		FirstName: giftRecipient.firstName,
		LastName: giftRecipient.lastName,
		...createMailingAddressFields(user),
		RecordTypeId: '01220000000VB50AAG',
	};
};

const createDigitalOnlyContactRecordRequest = (
	user: User,
): DigitalOnlyContactRecordRequest => {
	//optional address fields?
	return {
		Email: user.primaryEmailAddress,
		Salutation: user.title,
		FirstName: user.firstName,
		LastName: user.lastName,
		Phone: user.telephoneNumber,
		RecordTypeId: '01220000000VB50AAG',
	};
};

export const createContactRecordRequest = (
	user: User,
	contactType: 'Standard' | 'DeliveryOrRecipient',
):
	| StandardContactRecordRequest
	| DeliveryContactRecordRequest
	| DigitalOnlyContactRecordRequest => {
	console.log('Creating contact record of type:', contactType);
	switch (contactType) {
		case 'Standard':
			return createStandardContactRecordRequest(user);
		case 'DeliveryOrRecipient':
			return createDeliveryContactRecordRequest(user);
		case 'DigitalOnly':
			return createDigitalOnlyContactRecordRequest(user);
	}
};

//todo refine this
const getContactType = (
	user: User,
): 'Standard' | 'DeliveryOrRecipient' | 'DigitalOnly' => {
	if (!user.deliveryAddress) {
		//todo refine this
		return 'DeliveryOrRecipient';
	}
	if (!user.billingAddress) {
		//todo refine this
		return 'DigitalOnly';
	}
	return 'Standard';
};
