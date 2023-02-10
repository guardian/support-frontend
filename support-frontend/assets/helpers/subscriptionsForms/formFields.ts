import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import { getSubscriptionType } from 'helpers/redux/checkout/product/selectors/productType';
import type { SubscriptionsState } from 'helpers/redux/subscriptionsStore';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { DateYMDString } from 'helpers/types/DateString';
import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';

type GiftingFields = {
	titleGiftRecipient?: Title;
	firstNameGiftRecipient: string;
	lastNameGiftRecipient: string;
	emailGiftRecipient: string;
	giftMessage?: string;
	giftDeliveryDate?: string;
};

type ProductFields = {
	billingPeriod: BillingPeriod;
	fulfilmentOption: FulfilmentOptions;
	product: SubscriptionProduct;
	productOption: ProductOptions;
	orderIsAGift: boolean;
	startDate: DateYMDString;
};

export type FormFields = PersonalDetailsState &
	GiftingFields &
	ProductFields & {
		paymentMethod: PaymentMethod;
		billingAddressIsSame: boolean;
		deliveryInstructions: Option<string>;
		csrUsername?: string;
		salesforceCaseId?: string;
	};
export type FormField = keyof FormFields | 'recaptcha';
export type FormState = Omit<
	FormFields,
	| keyof PersonalDetailsState
	| keyof GiftingFields
	| keyof ProductFields
	| 'paymentMethod'
> & {
	stage: Stage;
	formErrors: Array<FormError<FormField>>;
	submissionError: Option<ErrorReason>;
	formSubmitted: boolean;
};

function getFormFields(state: SubscriptionsState): FormFields {
	return {
		title: state.page.checkoutForm.personalDetails.title,
		firstName: state.page.checkoutForm.personalDetails.firstName,
		lastName: state.page.checkoutForm.personalDetails.lastName,
		email: state.page.checkoutForm.personalDetails.email,
		confirmEmail: state.page.checkoutForm.personalDetails.confirmEmail,
		isSignedIn: state.page.user.isSignedIn,
		userTypeFromIdentityResponse:
			state.page.checkoutForm.personalDetails.userTypeFromIdentityResponse,
		telephone: state.page.checkoutForm.personalDetails.telephone,
		titleGiftRecipient: state.page.checkoutForm.gifting.title,
		firstNameGiftRecipient: state.page.checkoutForm.gifting.firstName,
		lastNameGiftRecipient: state.page.checkoutForm.gifting.lastName,
		emailGiftRecipient: state.page.checkoutForm.gifting.email,
		startDate: state.page.checkoutForm.product.startDate,
		billingPeriod: state.page.checkoutForm.product.billingPeriod,
		paymentMethod: state.page.checkoutForm.payment.paymentMethod.name,
		fulfilmentOption: state.page.checkoutForm.product.fulfilmentOption,
		productOption: state.page.checkoutForm.product.productOption,
		product: getSubscriptionType(state),
		billingAddressIsSame: state.page.checkout.billingAddressIsSame,
		orderIsAGift: state.page.checkoutForm.product.orderIsAGift,
		deliveryInstructions: state.page.checkout.deliveryInstructions,
		giftMessage: state.page.checkoutForm.gifting.giftMessage,
		giftDeliveryDate: state.page.checkoutForm.gifting.giftDeliveryDate,
	};
}

function getEmail(state: CheckoutState): string {
	return state.page.checkoutForm.personalDetails.email;
}

export { getFormFields, getEmail };
