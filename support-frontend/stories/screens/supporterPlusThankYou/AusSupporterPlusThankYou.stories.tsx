import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import {
	setEmail,
	setFirstName,
	setLastName,
	setUserTypeFromIdentityResponse,
} from 'helpers/redux/checkout/personalDetails/actions';
import {
	setProductType,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { setCountryInternationalisation } from 'helpers/redux/commonState/actions';
import { defaultUserActionFunctions } from 'helpers/user/defaultUserActionFunctions';
import type { RegularContribType } from 'pages/contributions-landing/components/DigiSubBenefits/helpers';
import { benefitsThresholdsByCountryGroup } from 'pages/contributions-landing/components/DigiSubBenefits/helpers';
import {
	largeDonations,
	SupporterPlusThankYou,
} from 'pages/supporter-plus-thank-you/supporterPlusThankYou';

export default {
	component: SupporterPlusThankYou,
	title: 'Screens/Supporter Plus Thank You Page/Australia',
	argTypes: {
		paymentMethod: {
			options: [
				Stripe,
				PayPal,
				DirectDebit,
				Sepa,
				ExistingCard,
				ExistingDirectDebit,
				AmazonPay,
			],
			control: { type: 'radio' },
			if: { arg: 'paymentMethod', exists: true },
		},
		nameIsOverTenCharacters: {
			options: [true, false],
			control: { type: 'radio' },
			if: { arg: 'nameIsOverTenCharacters', exists: true },
		},
		shouldShowLargeDonationMessage: {
			options: [true, false],
			control: { type: 'radio' },
			if: { arg: 'shouldShowLargeDonationMessage', exists: true },
		},
		amountIsAboveThreshold: {
			options: [true, false],
			control: { type: 'radio' },
			if: { arg: 'amountIsAboveThreshold', exists: true },
		},
		contributionType: {
			options: ['MONTHLY', 'ANNUAL'],
			control: { type: 'radio' },
			if: { arg: 'contributionType', exists: true },
		},
		countryGroup: {
			table: {
				disable: true,
			},
		},
	},
};

function Template() {
	return <SupporterPlusThankYou />;
}

Template.args = {} as Record<string, unknown>;
Template.parameters = {} as Record<string, unknown>;
Template.decorators = [] as unknown[];

export interface SupporterPlusThankYouArgs {
	contributionType: ContributionType;
	paymentMethod: PaymentMethod;
	nameIsOverTenCharacters: boolean;
	shouldShowLargeDonationMessage: boolean;
	amountIsAboveThreshold: boolean;
	countryGroup: CountryGroupId;
}

export const OneOffNotSignedIn = Template.bind({});

OneOffNotSignedIn.args = {
	paymentMethod: Stripe,
	shouldShowLargeDonationMessage: true,
};

OneOffNotSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: Record<string, SupporterPlusThankYouArgs>,
	): JSX.Element => {
		const { paymentMethod, shouldShowLargeDonationMessage } = args;

		const store = createTestStoreForContributions();

		store.dispatch(setCountryInternationalisation('AU'));
		store.dispatch(setProductType('ONE_OFF'));
		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod(paymentMethod));

		store.dispatch(
			setSelectedAmount(
				shouldShowLargeDonationMessage
					? {
							contributionType: 'ONE_OFF',
							amount: `${largeDonations['ONE_OFF'] + 5}`,
					  }
					: {
							contributionType: 'ONE_OFF',
							amount: `${largeDonations['ONE_OFF'] - 5}`,
					  },
			),
		);

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const OneOffSignedIn = Template.bind({});

OneOffSignedIn.args = {
	paymentMethod: Stripe,
	shouldShowLargeDonationMessage: true,
};

OneOffSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: Record<string, SupporterPlusThankYouArgs>,
	): JSX.Element => {
		const { paymentMethod, shouldShowLargeDonationMessage } = args;

		const store = createTestStoreForContributions();

		store.dispatch(setCountryInternationalisation('AU'));
		store.dispatch(defaultUserActionFunctions.setIsSignedIn(true));
		store.dispatch(setProductType('ONE_OFF'));
		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod(paymentMethod));

		store.dispatch(
			setSelectedAmount(
				shouldShowLargeDonationMessage
					? {
							contributionType: 'ONE_OFF',
							amount: `${largeDonations['ONE_OFF'] + 5}`,
					  }
					: {
							contributionType: 'ONE_OFF',
							amount: `${largeDonations['ONE_OFF'] - 5}`,
					  },
			),
		);

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const OneOffSignUp = Template.bind({});

OneOffSignUp.args = {
	paymentMethod: Stripe,
	shouldShowLargeDonationMessage: true,
};

OneOffSignUp.decorators = [
	(
		Story: React.FC,
		{ args }: Record<string, SupporterPlusThankYouArgs>,
	): JSX.Element => {
		const { paymentMethod, shouldShowLargeDonationMessage } = args;

		const store = createTestStoreForContributions();

		store.dispatch(setCountryInternationalisation('AU'));
		// is a new account
		store.dispatch(setUserTypeFromIdentityResponse('new'));
		store.dispatch(defaultUserActionFunctions.setIsSignedIn(true));
		store.dispatch(setProductType('ONE_OFF'));
		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod(paymentMethod));

		store.dispatch(
			setSelectedAmount(
				shouldShowLargeDonationMessage
					? {
							contributionType: 'ONE_OFF',
							amount: `${largeDonations['ONE_OFF'] + 5}`,
					  }
					: {
							contributionType: 'ONE_OFF',
							amount: `${largeDonations['ONE_OFF'] - 5}`,
					  },
			),
		);

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const RecurringNotSignedIn = Template.bind({});

RecurringNotSignedIn.args = {
	paymentMethod: Stripe,
	contributionType: 'MONTHLY',
	nameIsOverTenCharacters: true,
	amountIsAboveThreshold: true,
};

RecurringNotSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: Record<string, SupporterPlusThankYouArgs>,
	): JSX.Element => {
		const {
			contributionType,
			paymentMethod,
			nameIsOverTenCharacters,
			amountIsAboveThreshold,
		} = args;

		const store = createTestStoreForContributions();

		store.dispatch(setCountryInternationalisation('AU'));
		store.dispatch(setProductType(contributionType));
		store.dispatch(setUserTypeFromIdentityResponse('guest'));
		store.dispatch(
			setFirstName(nameIsOverTenCharacters ? 'NameIsOverTenCharacters' : 'Joe'),
		);
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod(paymentMethod));

		const thresholdPrice =
			benefitsThresholdsByCountryGroup['AUDCountries'][
				contributionType as RegularContribType
			];

		store.dispatch(
			setSelectedAmount(
				amountIsAboveThreshold
					? {
							contributionType,
							amount: `${thresholdPrice + 5}`,
					  }
					: {
							contributionType,
							amount: `${thresholdPrice - 5}`,
					  },
			),
		);

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const RecurringSignedIn = Template.bind({});

RecurringSignedIn.args = {
	paymentMethod: Stripe,
	contributionType: 'MONTHLY',
	nameIsOverTenCharacters: true,
	amountIsAboveThreshold: true,
};

RecurringSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: Record<string, SupporterPlusThankYouArgs>,
	): JSX.Element => {
		const {
			contributionType,
			paymentMethod,
			nameIsOverTenCharacters,
			amountIsAboveThreshold,
		} = args;

		const store = createTestStoreForContributions();

		store.dispatch(setCountryInternationalisation('AU'));
		store.dispatch(defaultUserActionFunctions.setIsSignedIn(true));
		store.dispatch(setUserTypeFromIdentityResponse('current'));
		store.dispatch(setProductType(contributionType));
		store.dispatch(
			setFirstName(nameIsOverTenCharacters ? 'NameIsOverTenCharacters' : 'Joe'),
		);
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod(paymentMethod));

		const thresholdPrice =
			benefitsThresholdsByCountryGroup['AUDCountries'][
				contributionType as RegularContribType
			];

		store.dispatch(
			setSelectedAmount(
				amountIsAboveThreshold
					? {
							contributionType,
							amount: `${thresholdPrice + 5}`,
					  }
					: {
							contributionType,
							amount: `${thresholdPrice - 5}`,
					  },
			),
		);

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];

export const RecurringSignUp = Template.bind({});

RecurringSignUp.args = {
	paymentMethod: Stripe,
	contributionType: 'MONTHLY',
	nameIsOverTenCharacters: true,
	amountIsAboveThreshold: true,
};

RecurringSignUp.decorators = [
	(
		Story: React.FC,
		{ args }: Record<string, SupporterPlusThankYouArgs>,
	): JSX.Element => {
		const {
			contributionType,
			paymentMethod,
			nameIsOverTenCharacters,
			amountIsAboveThreshold,
		} = args;

		const store = createTestStoreForContributions();

		store.dispatch(setCountryInternationalisation('AU'));
		// is a new account
		store.dispatch(setUserTypeFromIdentityResponse('new'));
		store.dispatch(defaultUserActionFunctions.setIsSignedIn(true));
		store.dispatch(setProductType(contributionType));
		store.dispatch(
			setFirstName(nameIsOverTenCharacters ? 'NameIsOverTenCharacters' : 'Joe'),
		);
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod(paymentMethod));

		const thresholdPrice =
			benefitsThresholdsByCountryGroup['AUDCountries'][
				contributionType as RegularContribType
			];

		store.dispatch(
			setSelectedAmount(
				amountIsAboveThreshold
					? {
							contributionType,
							amount: `${thresholdPrice + 5}`,
					  }
					: {
							contributionType,
							amount: `${thresholdPrice - 5}`,
					  },
			),
		);

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];
