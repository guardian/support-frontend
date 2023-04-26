import {
	checkGiftStartDate,
	checkOptionalEmail,
	emailAddressesMatch,
	isValidEmail,
} from 'helpers/forms/formValidation';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import type { FormField, FormFields } from './formFields';
import {
	formError,
	nonEmptyString,
	notLongerThan,
	notNull,
	validate,
	zuoraCompatibleString,
} from './validation';
import type { FormError } from './validation';

type CheckoutRule = {
	rule: boolean;
	error: FormError<FormField>;
};

function applyPersonalDetailsRules(
	fields: PersonalDetailsState,
): Array<FormError<FormField>> {
	const personalDetailsRules: CheckoutRule[] = [
		{
			rule: nonEmptyString(fields.firstName),
			error: formError('firstName', 'Please enter a first name.'),
		},
		{
			rule: zuoraCompatibleString(fields.firstName),
			error: formError(
				'firstName',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: notLongerThan(fields.firstName, 40),
			error: formError('firstName', 'First name is too long.'),
		},
		{
			rule: nonEmptyString(fields.lastName),
			error: formError('lastName', 'Please enter a last name.'),
		},
		{
			rule: zuoraCompatibleString(fields.lastName),
			error: formError(
				'lastName',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: notLongerThan(fields.lastName, 40),
			error: formError('lastName', 'Last name is too long'),
		},
		{
			rule: zuoraCompatibleString(fields.telephone),
			error: formError(
				'telephone',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: nonEmptyString(fields.email),
			error: formError('email', 'Please enter an email address.'),
		},
		{
			rule: isValidEmail(fields.email),
			error: formError('email', 'Please enter a valid email address.'),
		},
		{
			rule: notLongerThan(fields.email, 80),
			error: formError('email', 'Email address is too long.'),
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
	return validate(personalDetailsRules);
}

function applyCheckoutRules(fields: FormFields): Array<FormError<FormField>> {
	const { orderIsAGift, product, isSignedIn } = fields;
	const userFormFields: CheckoutRule[] = [
		{
			rule: nonEmptyString(fields.firstName),
			error: formError('firstName', 'Please enter a first name.'),
		},
		{
			rule: zuoraCompatibleString(fields.firstName),
			error: formError(
				'firstName',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: notLongerThan(fields.firstName, 40),
			error: formError('firstName', 'First name is too long.'),
		},
		{
			rule: nonEmptyString(fields.lastName),
			error: formError('lastName', 'Please enter a last name.'),
		},
		{
			rule: zuoraCompatibleString(fields.lastName),
			error: formError(
				'lastName',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: notLongerThan(fields.lastName, 40),
			error: formError('lastName', 'Last name is too long'),
		},
		{
			rule: zuoraCompatibleString(fields.telephone),
			error: formError(
				'telephone',
				'Please use only letters, numbers and punctuation.',
			),
		},
		{
			rule: nonEmptyString(fields.email),
			error: formError('email', 'Please enter an email address.'),
		},
		{
			rule: isValidEmail(fields.email),
			error: formError('email', 'Please enter a valid email address.'),
		},
		{
			rule: notLongerThan(fields.email, 80),
			error: formError('email', 'Email address is too long.'),
		},
		{
			rule: emailAddressesMatch(isSignedIn, fields.email, fields.confirmEmail),
			error: formError('confirmEmail', 'The email addresses do not match.'),
		},
		{
			rule: notNull(fields.paymentMethod),
			error: formError('paymentMethod', 'Please select a payment method.'),
		},
	];
	const giftFormFields: CheckoutRule[] =
		product === 'DigitalPack'
			? [
					{
						rule: nonEmptyString(fields.firstNameGiftRecipient),
						error: formError(
							'firstNameGiftRecipient',
							"Please enter the recipient's first name.",
						),
					},
					{
						rule: zuoraCompatibleString(fields.firstNameGiftRecipient),
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
						rule: zuoraCompatibleString(fields.lastNameGiftRecipient),
						error: formError(
							'lastNameGiftRecipient',
							'Please use only letters, numbers and punctuation.',
						),
					},
					{
						rule: nonEmptyString(fields.emailGiftRecipient),
						error: formError(
							'emailGiftRecipient',
							'Please enter an email address for the recipient.',
						),
					},
					{
						rule: isValidEmail(fields.emailGiftRecipient),
						error: formError(
							'emailGiftRecipient',
							'Please enter a valid email address for the recipient.',
						),
					},
					{
						rule: notLongerThan(fields.emailGiftRecipient, 80),
						error: formError(
							'emailGiftRecipient',
							'Email address is too long.',
						),
					},
					{
						rule: checkGiftStartDate(fields.giftDeliveryDate),
						error: formError(
							'giftDeliveryDate',
							'Please enter a valid delivery date for your gift.',
						),
					},
			  ]
			: [
					{
						rule: nonEmptyString(fields.firstNameGiftRecipient),
						error: formError(
							'firstNameGiftRecipient',
							"Please enter the recipient's first name.",
						),
					},
					{
						rule: zuoraCompatibleString(fields.firstNameGiftRecipient),
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
						rule: zuoraCompatibleString(fields.lastNameGiftRecipient),
						error: formError(
							'lastNameGiftRecipient',
							'Please use only letters, numbers and punctuation.',
						),
					},
					{
						rule:
							checkOptionalEmail(fields.emailGiftRecipient) &&
							zuoraCompatibleString(fields.emailGiftRecipient),
						error: formError(
							'emailGiftRecipient',
							'Please use a valid email address for the recipient.',
						),
					},
			  ];
	const formFieldsToCheck = orderIsAGift
		? [...userFormFields, ...giftFormFields]
		: userFormFields;
	return validate(formFieldsToCheck);
}

function applyDeliveryRules(fields: FormFields): Array<FormError<FormField>> {
	const deliveryRules: CheckoutRule[] = [
		{
			rule: notNull(fields.startDate),
			error: formError('startDate', 'Please select a start date'),
		},
		{
			rule: notNull(fields.billingAddressMatchesDelivery),
			error: formError(
				'billingAddressMatchesDelivery',
				'Please indicate whether the billing address is the same as the delivery address',
			),
		},
		{
			rule: zuoraCompatibleString(fields.deliveryInstructions),
			error: formError(
				'deliveryInstructions',
				'Please use only letters, numbers and punctuation.',
			),
		},
	];
	return validate(deliveryRules).concat(applyCheckoutRules(fields));
}

export { applyCheckoutRules, applyDeliveryRules, applyPersonalDetailsRules };
