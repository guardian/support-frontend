import type { ProductPurchase } from '@guardian/support-service-lambdas/modules/product-catalog/src/productPurchaseSchema';
import type {
	IsoCountry,
	UsState,
} from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import type { PaymentIntentResult, PaymentMethod } from '@stripe/stripe-js';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { StripeHostedCheckout } from 'helpers/forms/paymentMethods';
import type {
	DirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type { ReaderType } from 'helpers/productPrice/readerType';
import type {
	DigitalPack,
	GuardianWeekly,
	Paper,
} from 'helpers/productPrice/subscriptions';
import type { UserType } from 'helpers/redux/checkout/personalDetails/state';
import type {
	AcquisitionABTest,
	OphanIds,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';

// ----- Types ----- //
export type StripePaymentMethod =
	| 'StripeCheckout'
	| 'StripeElements'
	// We use Stripe’s payment request button element
	// (https://stripe.com/docs/stripe-js/elements/payment-request-button) for
	// taking Apple Pay and Google Pay payments (and possibly a third wallet I’m
	// unaware of).
	// However, we still use these values to distinguish Apple Pay payments from
	// non-Apple Pay payments. Therefore `StripeApplePay` means ”Apple Pay, via
	// the payment request button”, and `StripePaymentRequestButton` means “any
	// non-Apple-Pay payment method (wallet) that uses the payment request
	// button”
	| 'StripeApplePay'
	| 'StripePaymentRequestButton';
type RegularContribution = {
	productType: 'Contribution';
	amount: number;
	currency: string;
	billingPeriod: BillingPeriod;
};
type SupporterPlus = {
	productType: 'SupporterPlus';
	amount: number;
	currency: string;
	billingPeriod: BillingPeriod;
};
type TierThree = {
	productType: 'TierThree';
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
	productOptions: ProductOptions;
};
type GuardianAdLite = {
	productType: 'GuardianAdLite';
	currency: string;
	billingPeriod: BillingPeriod;
};
type DigitalSubscription = {
	productType: typeof DigitalPack;
	currency: string;
	billingPeriod: BillingPeriod;
	readerType: ReaderType;
	amount?: number;
};
type PaperSubscription = {
	productType: typeof Paper;
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
	productOptions: ProductOptions;
	deliveryAgent?: number;
};
type GuardianWeeklySubscription = {
	productType: typeof GuardianWeekly;
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
};
type SubscriptionProductFields =
	| SupporterPlus
	| DigitalSubscription
	| PaperSubscription
	| GuardianWeeklySubscription
	| TierThree
	| GuardianAdLite;
export type ProductFields = RegularContribution | SubscriptionProductFields;
type RegularPayPalPaymentFields = {
	paymentType: typeof PayPal;
	baid: string;
};
type RegularStripePaymentIntentFields = {
	paymentType: typeof Stripe;
	paymentMethod: string | PaymentMethod;
	// The ID of the Stripe Payment Method
	stripePaymentType: StripePaymentMethod; // The type of Stripe payment, e.g. Apple Pay
	stripePublicKey: string;
};
type RegularDirectDebitPaymentFields = {
	paymentType: typeof DirectDebit;
	accountHolderName: string;
	sortCode: string;
	accountNumber: string;
	recaptchaToken?: string;
};
type RegularSepaPaymentFields = {
	paymentType: typeof Sepa;
	accountHolderName: string;
	iban: string;
	country?: Option<string>;
	streetName?: Option<string>;
};
type RegularStripeHostedCheckoutPaymentFields = {
	paymentType: typeof StripeHostedCheckout;
	checkoutSessionId?: string;
	stripePublicKey: string;
};
export type RegularPaymentFields =
	| RegularPayPalPaymentFields
	| RegularStripePaymentIntentFields
	| RegularDirectDebitPaymentFields
	| RegularSepaPaymentFields
	| RegularStripeHostedCheckoutPaymentFields;
type RegularPaymentRequestAddress = {
	country: IsoCountry;
	state?: UsState | null;
	lineOne?: Option<string>;
	lineTwo?: Option<string>;
	postCode?: Option<string>;
	city?: Option<string>;
};
export type GiftRecipientType = {
	title?: Title;
	firstName: string;
	lastName: string;
	email?: string;
	message?: string;
	deliveryDate?: string;
};
export type AppliedPromotion = {
	promoCode: string;
	supportRegionId: SupportRegionId;
};
// The model that is sent to support-workers
export type RegularPaymentRequest = {
	title?: Title;
	firstName: string;
	lastName: string;
	billingAddress: RegularPaymentRequestAddress;
	deliveryAddress?: RegularPaymentRequestAddress;
	email: string;
	giftRecipient?: GiftRecipientType;
	product: ProductFields;
	productInformation?: ProductPurchase;
	firstDeliveryDate: Option<string>;
	paymentFields: RegularPaymentFields;
	ophanIds: OphanIds;
	referrerAcquisitionData: ReferrerAcquisitionData;
	supportAbTests: AcquisitionABTest[];
	telephoneNumber?: string;
	appliedPromotion?: AppliedPromotion;
	deliveryInstructions?: string;
	csrUsername?: string;
	salesforceCaseId?: string;
	recaptchaToken?: string;
	debugInfo: string;
	similarProductsConsent?: boolean;
};
type StripePaymentIntentAuthorisation = {
	paymentMethod: typeof Stripe;
	stripePaymentMethod: StripePaymentMethod;
	paymentMethodId: string | PaymentMethod;
	handle3DS?: (clientSecret: string) => Promise<PaymentIntentResult>;
};
type PayPalAuthorisation = {
	paymentMethod: typeof PayPal;
	token: string;
};
type DirectDebitAuthorisation = {
	paymentMethod: typeof DirectDebit;
	accountHolderName: string;
	sortCode: string;
	accountNumber: string;
};
type SepaAuthorisation = {
	paymentMethod: typeof Sepa;
	accountHolderName: string;
	iban: string;
	country?: string;
	streetName?: string;
};
// Represents an authorisation to execute payments with a given payment method.
// This will generally be supplied by third-party code (Stripe, PayPal, GoCardless).
// It applies both to one-off payments, where it is sent to the Payment API which
// immediately executes the payment, and recurring, where it ultimately ends up in Zuora
// which uses it to execute payments in the future.
export type PaymentAuthorisation =
	| StripePaymentIntentAuthorisation
	| PayPalAuthorisation
	| DirectDebitAuthorisation
	| SepaAuthorisation;

type Status = 'failure' | 'pending' | 'success';

// Represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// The only method/type combination which will not make use of this PayPal one-off,
// because the end of that checkout happens on the backend after the user is redirected to our site.
export type PaymentResult = {
	paymentStatus: Status;
	subscriptionCreationPending?: true;
	error?: ErrorReason;
	userType?: UserType;
};

export type StatusResponse = {
	status: Status;
	trackingUri: string;
	failureReason?: ErrorReason;
};

// ----- Setup ----- //
const PaymentSuccess: PaymentResult = {
	paymentStatus: 'success',
};

export { PaymentSuccess };
