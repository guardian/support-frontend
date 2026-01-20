import type { IsoCountry } from '@modules/internationalisation/country';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { ProductPurchase } from '@modules/product-catalog/productPurchaseSchema';
import { ReaderType } from '@modules/zuora/createSubscription/readerType';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { PaymentMethod } from '../model/paymentMethod';
import type { ProductType } from '../model/productType';
import type {
	SendAcquisitionEventState,
	SendThankYouEmailState,
} from '../model/sendAcquisitionEventState';
import type {
	AbTest,
	AcquisitionData,
	QueryParam,
} from '../model/stateSchemas';

type AcquisitionProduct =
	| 'RECURRING_CONTRIBUTION'
	| 'SUPPORTER_PLUS'
	| 'TIER_THREE'
	| 'DIGITAL_SUBSCRIPTION'
	| 'PRINT_SUBSCRIPTION'
	| 'GUARDIAN_AD_LITE';
type PaymentFrequency = 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
type PaymentProvider =
	| 'STRIPE'
	| 'STRIPE_APPLE_PAY'
	| 'STRIPE_PAYMENT_REQUEST_BUTTON'
	| 'PAYPAL'
	| 'GOCARDLESS';
type PrintProduct =
	| 'HOME_DELIVERY_EVERYDAY'
	| 'HOME_DELIVERY_EVERYDAY_PLUS'
	| 'HOME_DELIVERY_SIXDAY'
	| 'HOME_DELIVERY_SIXDAY_PLUS'
	| 'HOME_DELIVERY_WEEKEND'
	| 'HOME_DELIVERY_WEEKEND_PLUS'
	| 'HOME_DELIVERY_SATURDAY'
	| 'HOME_DELIVERY_SATURDAY_PLUS'
	| 'HOME_DELIVERY_SUNDAY'
	| 'NATIONAL_DELIVERY_EVERYDAY'
	| 'NATIONAL_DELIVERY_EVERYDAY_PLUS'
	| 'NATIONAL_DELIVERY_SIXDAY'
	| 'NATIONAL_DELIVERY_SIXDAY_PLUS'
	| 'NATIONAL_DELIVERY_WEEKEND'
	| 'NATIONAL_DELIVERY_WEEKEND_PLUS'
	| 'VOUCHER_EVERYDAY'
	| 'VOUCHER_EVERYDAY_PLUS'
	| 'VOUCHER_SIXDAY'
	| 'VOUCHER_SIXDAY_PLUS'
	| 'VOUCHER_WEEKEND'
	| 'VOUCHER_WEEKEND_PLUS'
	| 'VOUCHER_SATURDAY'
	| 'VOUCHER_SATURDAY_PLUS'
	| 'VOUCHER_SUNDAY'
	| 'GUARDIAN_WEEKLY';

type AcquisitionTypeDetails = {
	paymentMethod: PaymentMethod;
	promoCode?: string;
	readerType: ReaderType;
	zuoraAccountNumber?: string;
	zuoraSubscriptionNumber?: string;
};

type PrintOptions = {
	product: PrintProduct;
	deliveryCountry: IsoCountry;
};

export type AcquisitionDataRow = {
	eventTimeStamp: Dayjs;
	product: AcquisitionProduct;
	amount?: number;
	country: string;
	currency: string;
	componentId?: string;
	componentType?: string;
	campaignCode?: string;
	source?: string;
	referrerUrl?: string;
	abTests: AbTest[];
	paymentFrequency: PaymentFrequency;
	paymentProvider?: PaymentProvider;
	printOptions?: PrintOptions;
	browserId?: string;
	identityId?: string;
	pageViewId?: string;
	referrerPageViewId?: string;
	labels: string[];
	promoCode?: string;
	reusedExistingPaymentMethod: boolean;
	readerType: ReaderType;
	acquisitionType: 'Purchase';
	zuoraSubscriptionNumber?: string;
	contributionId?: string;
	paymentId?: string;
	queryParameters: QueryParam[];
	platform?: string;
	postalCode?: string;
	state?: string;
	email?: string;
	similarProductsConsent: boolean;
	paypalTransactionId?: string;
};

export function buildFromState(
	state: SendAcquisitionEventState,
): AcquisitionDataRow {
	const common = state.sendThankYouEmailState;
	const { product, amount } = productTypeAndAmount(common.product);
	const details = getAcquisitionTypeDetails(common);
	const printOptions = printOptionsFromProduct(
		common.productInformation,
		common.user.deliveryAddress?.country,
	);

	return {
		eventTimeStamp: dayjs(),
		product,
		amount,
		country: common.user.billingAddress.country,
		currency: common.product.currency,
		componentId: state.acquisitionData?.referrerAcquisitionData.componentId,
		componentType: state.acquisitionData?.referrerAcquisitionData.componentType,
		campaignCode:
			state.acquisitionData?.referrerAcquisitionData.campaignCode ?? undefined,
		source: state.acquisitionData?.referrerAcquisitionData.source ?? undefined,
		referrerUrl:
			state.acquisitionData?.referrerAcquisitionData.referrerUrl ?? undefined,
		abTests: state.acquisitionData ? getAbTests(state.acquisitionData) : [],
		paymentFrequency: paymentFrequencyFromBillingPeriod(common.product),
		paymentProvider: paymentProviderFromPaymentMethod(details.paymentMethod),
		printOptions,
		browserId: state.acquisitionData?.ophanIds.browserId,
		identityId: common.user.id,
		pageViewId: state.acquisitionData?.ophanIds.pageviewId,
		referrerPageViewId:
			state.acquisitionData?.referrerAcquisitionData.referrerPageviewId,
		labels: buildLabels(state),
		promoCode: details.promoCode,
		reusedExistingPaymentMethod: false,
		readerType: details.readerType,
		acquisitionType: 'Purchase',
		zuoraSubscriptionNumber: details.zuoraSubscriptionNumber,
		contributionId: undefined,
		paymentId: undefined,
		queryParameters: state.acquisitionData
			? getQueryParameters(state.acquisitionData)
			: [],
		platform: undefined,
		state: common.user.billingAddress.state,
		email: common.user.primaryEmailAddress,
		similarProductsConsent:
			common.productType !== 'GuardianAdLite'
				? common.similarProductsConsent ?? false
				: false,
		paypalTransactionId: undefined,
	};
}

function paymentFrequencyFromBillingPeriod(
	productType: ProductType,
): PaymentFrequency {
	const billingPeriod =
		productType.productType === 'GuardianAdLite'
			? BillingPeriod.Monthly
			: productType.billingPeriod;

	const map: Record<RecurringBillingPeriod, PaymentFrequency> = {
		Monthly: 'MONTHLY',
		Quarterly: 'QUARTERLY',
		Annual: 'ANNUALLY',
	};
	return map[billingPeriod];
}

function paymentProviderFromPaymentMethod(
	paymentMethod: PaymentMethod,
): PaymentProvider {
	if (paymentMethod.Type === 'CreditCardReferenceTransaction') {
		if (paymentMethod.StripePaymentType === 'StripeApplePay') {
			return 'STRIPE_APPLE_PAY';
		}
		if (paymentMethod.StripePaymentType === 'StripePaymentRequestButton') {
			return 'STRIPE_PAYMENT_REQUEST_BUTTON';
		}
		return 'STRIPE';
	}
	if (
		paymentMethod.Type === 'PayPal' ||
		paymentMethod.Type === 'PayPalCompletePaymentsWithBAID'
	) {
		return 'PAYPAL';
	}
	return 'GOCARDLESS';
}

function getAbTests(data: AcquisitionData): AbTest[] {
	const ref = data.referrerAcquisitionData.abTests
		? Array.from(data.referrerAcquisitionData.abTests)
		: [];
	return [...data.supportAbTests, ...ref];
}

function productTypeAndAmount(product: ProductType): {
	product: AcquisitionProduct;
	amount?: number;
} {
	switch (product.productType) {
		case 'Contribution':
			return { product: 'RECURRING_CONTRIBUTION', amount: product.amount };
		case 'SupporterPlus':
			return { product: 'SUPPORTER_PLUS' };
		case 'TierThree':
			return { product: 'TIER_THREE' };
		case 'DigitalPack':
			return { product: 'DIGITAL_SUBSCRIPTION' };
		case 'Paper':
		case 'GuardianWeekly':
			return { product: 'PRINT_SUBSCRIPTION' };
		case 'GuardianAdLite':
			return { product: 'GUARDIAN_AD_LITE' };
	}
}

function printOptionsFromProduct(
	productInformation: ProductPurchase,
	deliveryCountry?: IsoCountry,
): PrintOptions | undefined {
	if (
		productInformation.product === 'HomeDelivery' ||
		productInformation.product === 'NationalDelivery' ||
		productInformation.product === 'SubscriptionCard'
	) {
		return {
			product: toPrintProduct(productInformation),
			deliveryCountry: 'GB',
		};
	}
	if (
		productInformation.product === 'GuardianWeeklyDomestic' ||
		productInformation.product === 'GuardianWeeklyRestOfWorld'
	) {
		return {
			product: 'GUARDIAN_WEEKLY',
			deliveryCountry: deliveryCountry ?? 'GB',
		};
	}
	return undefined;
}

function toPrintProduct(productInformation: ProductPurchase): PrintProduct {
	switch (productInformation.product) {
		case 'HomeDelivery':
			switch (productInformation.ratePlan) {
				case 'EverydayPlus':
					return 'HOME_DELIVERY_EVERYDAY_PLUS';
				case 'SixdayPlus':
					return 'HOME_DELIVERY_SIXDAY_PLUS';
				case 'WeekendPlus':
					return 'HOME_DELIVERY_WEEKEND_PLUS';
				case 'SaturdayPlus':
					return 'HOME_DELIVERY_SATURDAY_PLUS';
				case 'Sunday':
					return 'HOME_DELIVERY_SUNDAY';
			}
			break;
		case 'NationalDelivery':
			switch (productInformation.ratePlan) {
				case 'EverydayPlus':
					return 'NATIONAL_DELIVERY_EVERYDAY_PLUS';
				case 'SixdayPlus':
					return 'NATIONAL_DELIVERY_SIXDAY_PLUS';
				case 'WeekendPlus':
					return 'NATIONAL_DELIVERY_WEEKEND_PLUS';
			}
			break;
		case 'SubscriptionCard':
			switch (productInformation.ratePlan) {
				case 'EverydayPlus':
					return 'VOUCHER_EVERYDAY_PLUS';
				case 'SixdayPlus':
					return 'VOUCHER_SIXDAY_PLUS';
				case 'WeekendPlus':
					return 'VOUCHER_WEEKEND_PLUS';
				case 'SaturdayPlus':
					return 'VOUCHER_SATURDAY_PLUS';
				case 'Sunday':
					return 'VOUCHER_SUNDAY';
			}
			break;
	}
	throw new Error(
		`Invalid productInformation ${JSON.stringify(productInformation)}`,
	);
}

function getAcquisitionTypeDetails(
	state: SendThankYouEmailState,
): AcquisitionTypeDetails {
	const promoCode = 'promoCode' in state ? state.promoCode : undefined;
	const readerType =
		'giftRecipient' in state && state.giftRecipient
			? ReaderType.Gift
			: promoCode?.endsWith('PATRON')
			? ReaderType.Patron
			: ReaderType.Direct;

	return {
		paymentMethod: state.paymentMethod,
		promoCode: promoCode,
		readerType: readerType,
		zuoraAccountNumber: state.accountNumber,
		zuoraSubscriptionNumber: state.subscriptionNumber,
	};
}

function buildLabels(state: SendAcquisitionEventState): string[] {
	const refLabels = state.acquisitionData?.referrerAcquisitionData.labels
		? Array.from(state.acquisitionData.referrerAcquisitionData.labels)
		: [];
	const giftLabel = state.analyticsInfo.isGiftPurchase
		? ['GIFT_SUBSCRIPTION']
		: [];
	return [...giftLabel, ...refLabels];
}

function getQueryParameters(data: AcquisitionData): QueryParam[] {
	return data.referrerAcquisitionData.queryParameters
		? Array.from(data.referrerAcquisitionData.queryParameters)
		: [];
}
