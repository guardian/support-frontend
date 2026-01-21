import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import type { DateYMDString } from 'helpers/types/DateString';
import type { Title } from 'helpers/user/details';

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

type FormFields = PersonalDetailsState &
	GiftingFields &
	ProductFields & {
		paymentMethod: PaymentMethod;
		billingAddressMatchesDelivery: boolean;
		deliveryInstructions?: string;
		csrUsername?: string;
		salesforceCaseId?: string;
		deliveryProvider?: number;
	};
export type FormField = keyof FormFields | 'recaptcha';
