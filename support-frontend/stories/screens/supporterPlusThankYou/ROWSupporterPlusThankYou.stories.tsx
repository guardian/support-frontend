import '__mocks__/settingsMock';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createTestStoreForContributions } from '__test-utils__/testStore';
import {
	AmazonPay,
	DirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
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
import { setIsSignedIn, setStorybookUser } from 'helpers/redux/user/actions';
import type { SupporterPlusThankYouProps } from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import {
	largeDonations,
	SupporterPlusThankYou,
} from 'pages/supporter-plus-thank-you/supporterPlusThankYou';
import type { SupporterPlusThankYouArgs } from './AusSupporterPlusThankYou.stories';

export default {
	component: SupporterPlusThankYou,
	title: 'Screens/Supporter Plus Thank You Page/Rest Of World',
	argTypes: {
		paymentMethod: {
			options: [Stripe, PayPal, DirectDebit, Sepa, AmazonPay],
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
			options: (Object.keys(countryGroups) as CountryGroupId[]).filter(
				(countryGroup) => countryGroup !== 'AUDCountries',
			),
			control: { type: 'radio' },
			if: { arg: 'countryGroup', exists: true },
		},
	},
};

const supporterPlusROWMonthlyThreshold = 13;

function Template(args: SupporterPlusThankYouProps) {
	return (
		<MemoryRouter>
			<SupporterPlusThankYou {...args} />
		</MemoryRouter>
	);
}

Template.args = {} as Record<string, unknown>;
Template.parameters = {} as Record<string, unknown>;
Template.decorators = [] as unknown[];

export const OneOffNotSignedIn = Template.bind({});

OneOffNotSignedIn.args = {
	paymentMethod: Stripe,
	shouldShowLargeDonationMessage: true,
	countryGroup: 'GBPCountries',
};

OneOffNotSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: { args: SupporterPlusThankYouArgs },
	): JSX.Element => {
		const { paymentMethod, shouldShowLargeDonationMessage, countryGroup } =
			args;

		const store = createTestStoreForContributions();

		store.dispatch(setStorybookUser(true));
		store.dispatch(setProductType('ONE_OFF'));
		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod({ paymentMethod }));

		const country = countryGroups[countryGroup].countries[0];
		if (country) {
			store.dispatch(setCountryInternationalisation(country));
		}

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

	countryGroup: 'GBPCountries',
};

OneOffSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: { args: SupporterPlusThankYouArgs },
	): JSX.Element => {
		const { paymentMethod, shouldShowLargeDonationMessage, countryGroup } =
			args;

		const store = createTestStoreForContributions();

		store.dispatch(setStorybookUser(true));
		store.dispatch(setIsSignedIn(true));
		store.dispatch(setProductType('ONE_OFF'));
		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod({ paymentMethod }));
		const country = countryGroups[countryGroup].countries[0];
		if (country) {
			store.dispatch(setCountryInternationalisation(country));
		}

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
	countryGroup: 'GBPCountries',
};

OneOffSignUp.decorators = [
	(
		Story: React.FC,
		{ args }: { args: SupporterPlusThankYouArgs },
	): JSX.Element => {
		const { paymentMethod, shouldShowLargeDonationMessage, countryGroup } =
			args;

		const store = createTestStoreForContributions();

		store.dispatch(setStorybookUser(true));
		// is a new account
		store.dispatch(setUserTypeFromIdentityResponse('new'));
		store.dispatch(setIsSignedIn(true));
		store.dispatch(setProductType('ONE_OFF'));
		store.dispatch(setFirstName('Joe'));
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod({ paymentMethod }));
		const country = countryGroups[countryGroup].countries[0];
		if (country) {
			store.dispatch(setCountryInternationalisation(country));
		}

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
	countryGroup: 'GBPCountries',
	overideThresholdPrice: supporterPlusROWMonthlyThreshold,
};

RecurringNotSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: { args: SupporterPlusThankYouArgs },
	): JSX.Element => {
		const {
			contributionType,
			paymentMethod,
			nameIsOverTenCharacters,
			amountIsAboveThreshold,
			countryGroup,
			overideThresholdPrice,
		} = args;

		const store = createTestStoreForContributions();

		store.dispatch(setStorybookUser(true));
		store.dispatch(setProductType(contributionType));
		store.dispatch(setUserTypeFromIdentityResponse('guest'));
		store.dispatch(
			setFirstName(nameIsOverTenCharacters ? 'NameIsOverTenCharacters' : 'Joe'),
		);
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod({ paymentMethod }));
		const country = countryGroups[countryGroup].countries[0];
		if (country) {
			store.dispatch(setCountryInternationalisation(country));
		}

		const thresholdAdjustment = amountIsAboveThreshold ? 5 : -5;
		store.dispatch(
			setSelectedAmount({
				contributionType,
				amount: `${overideThresholdPrice + thresholdAdjustment}`,
			}),
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
	countryGroup: 'GBPCountries',
	overideThresholdPrice: supporterPlusROWMonthlyThreshold,
};

RecurringSignedIn.decorators = [
	(
		Story: React.FC,
		{ args }: { args: SupporterPlusThankYouArgs },
	): JSX.Element => {
		const {
			contributionType,
			paymentMethod,
			nameIsOverTenCharacters,
			amountIsAboveThreshold,
			countryGroup,
			overideThresholdPrice,
		} = args;

		const store = createTestStoreForContributions();

		store.dispatch(setStorybookUser(true));
		store.dispatch(setIsSignedIn(true));
		store.dispatch(setUserTypeFromIdentityResponse('current'));
		store.dispatch(setProductType(contributionType));
		store.dispatch(
			setFirstName(nameIsOverTenCharacters ? 'NameIsOverTenCharacters' : 'Joe'),
		);
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod({ paymentMethod }));
		const country = countryGroups[countryGroup].countries[0];
		if (country) {
			store.dispatch(setCountryInternationalisation(country));
		}

		const thresholdAdjustment = amountIsAboveThreshold ? 5 : -5;
		store.dispatch(
			setSelectedAmount({
				contributionType,
				amount: `${overideThresholdPrice + thresholdAdjustment}`,
			}),
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
	countryGroup: 'GBPCountries',
	overideThresholdPrice: supporterPlusROWMonthlyThreshold,
};

RecurringSignUp.decorators = [
	(
		Story: React.FC,
		{ args }: { args: SupporterPlusThankYouArgs },
	): JSX.Element => {
		const {
			contributionType,
			paymentMethod,
			nameIsOverTenCharacters,
			amountIsAboveThreshold,
			countryGroup,
			overideThresholdPrice,
		} = args;

		const store = createTestStoreForContributions();

		store.dispatch(setStorybookUser(true));
		// is a new account
		store.dispatch(setUserTypeFromIdentityResponse('new'));
		store.dispatch(setIsSignedIn(true));
		store.dispatch(setProductType(contributionType));
		store.dispatch(
			setFirstName(nameIsOverTenCharacters ? 'NameIsOverTenCharacters' : 'Joe'),
		);
		store.dispatch(setLastName('Bloggs'));
		store.dispatch(setEmail('abcd@thegulocal.com'));
		store.dispatch(setPaymentMethod({ paymentMethod }));
		const country = countryGroups[countryGroup].countries[0];
		if (country) {
			store.dispatch(setCountryInternationalisation(country));
		}

		const thresholdAdjustment = amountIsAboveThreshold ? 5 : -5;
		store.dispatch(
			setSelectedAmount({
				contributionType,
				amount: `${overideThresholdPrice + thresholdAdjustment}`,
			}),
		);

		return (
			<Provider store={store}>
				<Story />
			</Provider>
		);
	},
];
