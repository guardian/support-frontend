import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import type { GuardianProduct } from 'helpers/redux/checkout/product/state';
import type {
	AnyCheckoutState,
	CheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
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
	product: GuardianProduct;
};

export type FormFields = PersonalDetailsState &
	GiftingFields &
	ProductFields & {
		paymentMethod: Option<PaymentMethod>;
		startDate: Option<string>;
		billingAddressIsSame: boolean;
		productOption: ProductOptions;
		orderIsAGift?: boolean;
		deliveryInstructions: Option<string>;
		csrUsername?: string;
		salesforceCaseId?: string;
	};
export type FormField = keyof FormFields | 'recaptcha';
export type FormState = Omit<
	FormFields,
	keyof PersonalDetailsState | keyof GiftingFields | keyof ProductFields
> & {
	stage: Stage;
	formErrors: Array<FormError<FormField>>;
	submissionError: Option<ErrorReason>;
	formSubmitted: boolean;
	isTestUser: boolean;
	productPrices: ProductPrices;
	payPalHasLoaded: boolean;
	stripePaymentMethod: Option<string>;
	debugInfo: string;
};

function getFormFields(state: AnyCheckoutState): FormFields {
	return {
		title: state.page.checkoutForm.personalDetails.title,
		firstName: state.page.checkoutForm.personalDetails.firstName,
		lastName: state.page.checkoutForm.personalDetails.lastName,
		email: state.page.checkoutForm.personalDetails.email,
		confirmEmail: state.page.checkoutForm.personalDetails.confirmEmail,
		isSignedIn: state.page.checkoutForm.personalDetails.isSignedIn,
		userTypeFromIdentityResponse:
			state.page.checkoutForm.personalDetails.userTypeFromIdentityResponse,
		telephone: state.page.checkoutForm.personalDetails.telephone,
		titleGiftRecipient: state.page.checkoutForm.gifting.title,
		firstNameGiftRecipient: state.page.checkoutForm.gifting.firstName,
		lastNameGiftRecipient: state.page.checkoutForm.gifting.lastName,
		emailGiftRecipient: state.page.checkoutForm.gifting.email,
		startDate: state.page.checkout.startDate,
		billingPeriod: state.page.checkoutForm.product.billingPeriod,
		paymentMethod: state.page.checkout.paymentMethod,
		fulfilmentOption: state.page.checkoutForm.product.fulfilmentOption,
		productOption: state.page.checkoutForm.product.productOption,
		product: state.page.checkoutForm.product.productType,
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
