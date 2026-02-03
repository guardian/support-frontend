import { storage } from '@guardian/libs';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type React from 'react';
import OnboardingSummary from 'components/onboarding/sections/summary';
import { fallBackLandingPageSelection } from 'helpers/abTests/landingPageAbTests';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

const stripeOrder = {
	firstName: 'Jontho',
	email: 'john.doe@example.com',
	paymentMethod: 'Stripe' as const,
	status: 'success' as const,
};

const paypalOrder = {
	firstName: 'Andre',
	email: 'jane.doe@example.com',
	paymentMethod: 'PayPal' as const,
	status: 'success' as const,
};

const directDebitOrder = {
	firstName: 'Alex',
	email: 'bob.smith@example.com',
	paymentMethod: 'DirectDebit' as const,
	status: 'success' as const,
	accountNumber: '1234',
};

export default {
	title: 'Onboarding/OnboardingSummary',
	component: OnboardingSummary,
	decorators: [
		(Story: React.FC): JSX.Element => (
			<div style={{ maxWidth: '600px', margin: '40px auto' }}>
				<Story />
			</div>
		),
		withSourceReset,
	],
	parameters: {
		layout: 'fullscreen',
	},
};

const defaultArgs = {
	productKey: 'SupporterPlus' as const,
	landingPageSettings: fallBackLandingPageSelection,
	supportRegionId: SupportRegionId.UK,
	csrf: { token: 'mock-csrf-token' },
	identityUserType: 'new' as const,
	ratePlanKey: 'Monthly' as const,
	payment: {
		originalAmount: 15,
		finalAmount: 15,
	},
};

export const MonthlyWithCard = {
	args: defaultArgs,
	decorators: [
		(Story: React.FC): JSX.Element => {
			storage.session.set('thankYouOrder', stripeOrder);
			return <Story />;
		},
	],
};

export const MonthlyWithPayPal = {
	args: defaultArgs,
	decorators: [
		(Story: React.FC): JSX.Element => {
			storage.session.set('thankYouOrder', paypalOrder);
			return <Story />;
		},
	],
};

export const MonthlyWithDirectDebit = {
	args: defaultArgs,
	decorators: [
		(Story: React.FC): JSX.Element => {
			storage.session.set('thankYouOrder', directDebitOrder);
			return <Story />;
		},
	],
};

export const AnnualWithCard = {
	args: {
		...defaultArgs,
		ratePlanKey: 'Annual' as const,
		payment: {
			originalAmount: 120,
			finalAmount: 120,
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => {
			storage.session.set('thankYouOrder', stripeOrder);
			return <Story />;
		},
	],
};

export const MonthlyWithPromotion = {
	args: {
		...defaultArgs,
		payment: {
			originalAmount: 15,
			discountedAmount: 10,
			finalAmount: 10,
		},
		promotion: {
			name: 'SUMMER2024',
			description: 'Summer sale',
			discount: {
				amount: 33,
				durationMonths: 12,
			},
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => {
			storage.session.set('thankYouOrder', stripeOrder);
			return <Story />;
		},
	],
};

export const USRegionMonthly = {
	args: {
		...defaultArgs,
		supportRegionId: SupportRegionId.US,
		payment: {
			originalAmount: 13,
			finalAmount: 13,
		},
	},
	decorators: [
		(Story: React.FC): JSX.Element => {
			storage.session.set('thankYouOrder', stripeOrder);
			return <Story />;
		},
	],
};
