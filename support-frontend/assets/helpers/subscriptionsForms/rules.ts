import {
	checkEmail,
	checkGiftStartDate,
	checkOptionalEmail,
	emailAddressesMatch,
} from 'helpers/forms/formValidation';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { RedemptionCheckoutState } from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import type { FormField, FormFields } from './formFields';
import {
	formError,
	nonEmptyString,
	nonSillyCharacters,
	notNull,
	validate,
} from './validation';
import type { FormError } from './validation';

type CheckoutRule = {
	rule: boolean;
	error: FormError<FormField>;
};

type CheckoutRuleTypes =
	| 'personalDetails'
	| 'paymentMethodSelected'
	| 'gifteeDetails'
	| 'gifteeOptionalEmail'
	| 'gifteeRequiredEmail'
	| 'giftDelivery';

function getRulesToUse(
	checkoutRules: { [key in CheckoutRuleTypes]: CheckoutRule[] },
	product: SubscriptionProduct,
	orderIsAGift: boolean,
) {
	const defaultWithPayment = [
		...checkoutRules.personalDetails,
		...checkoutRules.paymentMethodSelected,
	];
	if (orderIsAGift) {
		if (product === 'DigitalPack') {
			return [
				...defaultWithPayment,
				...checkoutRules.gifteeDetails,
				...checkoutRules.gifteeRequiredEmail,
				...checkoutRules.giftDelivery,
			];
		}
		return [
			...defaultWithPayment,
			...checkoutRules.gifteeDetails,
			...checkoutRules.gifteeOptionalEmail,
		];
	}
	return defaultWithPayment;
}

function applyRedemptionRules(
	fields: RedemptionCheckoutState,
): Array<FormError<FormField>> {
	const redemptionFormRules: CheckoutRule[] = [
		{
			rule: nonEmptyString(fields.firstName),
			error: formError('firstName', 'Please enter a first name.'),
		},
		{
			rule: nonSillyCharacters(fields.firstName),
			error: formError(
				'firstName',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: nonEmptyString(fields.lastName),
			error: formError('lastName', 'Please enter a last name.'),
		},
		{
			rule: nonSillyCharacters(fields.lastName),
			error: formError(
				'lastName',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: nonSillyCharacters(fields.telephone),
			error: formError(
				'telephone',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: checkEmail(fields.email),
			error: formError('email', 'Please enter a valid email address.'),
		},
		{
			rule: emailAddressesMatch(
				fields.isSignedIn,
				fields.email,
				fields.confirmEmail,
			),
			error: formError('confirmEmail', 'The email addresses do not match.'),
		},
	];
	return validate(redemptionFormRules);
}

function applyCheckoutRules(fields: FormFields): Array<FormError<FormField>> {
	const { orderIsAGift, product, isSignedIn } = fields;
	const checkoutRules: { [key in CheckoutRuleTypes]: CheckoutRule[] } = {
		personalDetails: [
			{
				rule: nonEmptyString(fields.firstName),
				error: formError('firstName', 'Please enter a first name.'),
			},
			{
				rule: nonSillyCharacters(fields.firstName),
				error: formError(
					'firstName',
					'Please use only letters, numbers and punctuation.',
				),
			},
			{
				rule: nonEmptyString(fields.lastName),
				error: formError('lastName', 'Please enter a last name.'),
			},
			{
				rule: nonSillyCharacters(fields.lastName),
				error: formError(
					'lastName',
					'Please use only letters, numbers and punctuation.',
				),
			},
			{
				rule: nonSillyCharacters(fields.telephone),
				error: formError(
					'telephone',
					'Please use only letters, numbers and punctuation.',
				),
			},
			{
				rule: checkEmail(fields.email),
				error: formError('email', 'Please enter a valid email address.'),
			},
			{
				rule: emailAddressesMatch(
					isSignedIn,
					fields.email,
					fields.confirmEmail,
				),
				error: formError('confirmEmail', 'The email addresses do not match.'),
			},
		],
		paymentMethodSelected: [
			{
				rule: notNull(fields.paymentMethod),
				error: formError('paymentMethod', 'Please select a payment method.'),
			},
		],
		gifteeDetails: [
			{
				rule: nonEmptyString(fields.firstNameGiftRecipient),
				error: formError(
					'firstNameGiftRecipient',
					"Please enter the recipient's first name.",
				),
			},
			{
				rule: nonSillyCharacters(fields.firstNameGiftRecipient),
				error: formError(
					'firstNameGiftRecipient',
					'Please use only letters, numbers and punctuation.',
				),
			},
			{
				rule: nonEmptyString(fields.lastNameGiftRecipient),
				error: formError(
					'lastNameGiftRecipient',
					"Please enter the recipient's last name.",
				),
			},
			{
				rule: nonSillyCharacters(fields.lastNameGiftRecipient),
				error: formError(
					'lastNameGiftRecipient',
					'Please use only letters, numbers and punctuation.',
				),
			},
		],
		gifteeOptionalEmail: [
			{
				rule:
					checkOptionalEmail(fields.emailGiftRecipient) &&
					nonSillyCharacters(fields.emailGiftRecipient),
				error: formError(
					'emailGiftRecipient',
					'Please use a valid email address for the recipient.',
				),
			},
		],
		gifteeRequiredEmail: [
			{
				rule:
					checkEmail(fields.emailGiftRecipient) &&
					nonSillyCharacters(fields.emailGiftRecipient),
				error: formError(
					'emailGiftRecipient',
					'Please use a valid email address for the recipient.',
				),
			},
		],
		giftDelivery: [
			{
				rule: checkGiftStartDate(fields.giftDeliveryDate),
				error: formError(
					'giftDeliveryDate',
					'Please enter a valid delivery date for your gift.',
				),
			},
		],
	};
	const formFieldsToCheck = getRulesToUse(
		checkoutRules,
		product,
		orderIsAGift ?? false,
	);
	return validate(formFieldsToCheck);
}

function applyDeliveryRules(fields: FormFields): Array<FormError<FormField>> {
	const deliveryRules: CheckoutRule[] = [
		{
			rule: notNull(fields.startDate),
			error: formError('startDate', 'Please select a start date'),
		},
		{
			rule: notNull(fields.billingAddressIsSame),
			error: formError(
				'billingAddressIsSame',
				'Please indicate whether the billing address is the same as the delivery address',
			),
		},
	];
	return validate(deliveryRules).concat(applyCheckoutRules(fields));
}

export { applyCheckoutRules, applyDeliveryRules, applyRedemptionRules };
