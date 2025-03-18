import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
	type CheckoutComponentProps,
	ThankYouComponent,
} from '../thankYouComponent';

jest.mock('../../checkout/helpers/sessionStorage', () => ({
	getThankYouOrder: () => 'order',
	getReturnAddress: () => 'adress',
}));

describe('thankYouComponent', () => {
	const defaultProps: CheckoutComponentProps = {
		geoId: 'uk',
		csrf: { token: 'token' },
		payment: {
			originalAmount: 12,
			finalAmount: 12,
		},
		identityUserType: 'new',
		abParticipations: {},
	};

	it('should display the correct thankyou cards for One time contribution', () => {
		render(<ThankYouComponent {...defaultProps} />);
		const feedback = screen.getByTestId('feedback');
		const signUp = screen.getByTestId('signUp');
		const supportReminder = screen.getByTestId('supportReminder');
		const socialShare = screen.getByTestId('socialShare');
		expect(feedback).toBeInTheDocument();
		expect(signUp).toBeInTheDocument();
		expect(supportReminder).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for Recurring Contribution for new users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="Contribution"
				ratePlanKey="Monthly"
			/>,
		);
		const signUp = screen.getByTestId('signUp');
		const signIn = screen.queryByTestId('signIn');
		const socialShare = screen.getByTestId('socialShare');
		expect(signUp).toBeInTheDocument();
		expect(signIn).not.toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for Recurring Contribution for existing users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="Contribution"
				ratePlanKey="Monthly"
				identityUserType="current"
			/>,
		);
		const signIn = screen.getByTestId('signIn');
		const signUp = screen.queryByTestId('signUp');
		const socialShare = screen.getByTestId('socialShare');
		expect(signIn).toBeInTheDocument();
		expect(signUp).not.toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for SupporterPlus for new users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="SupporterPlus"
				ratePlanKey="Monthly"
				identityUserType="current"
			/>,
		);
		const signIn = screen.getByTestId('signIn');
		const appsDownload = screen.getByTestId('appsDownload');
		const socialShare = screen.getByTestId('socialShare');
		expect(signIn).toBeInTheDocument();
		expect(appsDownload).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for TierThree for new users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="TierThree"
				ratePlanKey="Monthly"
				identityUserType="current"
			/>,
		);
		const signIn = screen.getByTestId('signIn');
		const benefits = screen.getByTestId('benefits');
		const appsDownload = screen.getByTestId('appsDownload');
		const subscriptionStart = screen.getByTestId('subscriptionStart');
		expect(signIn).toBeInTheDocument();
		expect(benefits).toBeInTheDocument();
		expect(appsDownload).toBeInTheDocument();
		expect(subscriptionStart).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for Guardian AdLite users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="GuardianAdLite"
				ratePlanKey="Monthly"
				identityUserType="current"
			/>,
		);
		const whatNext = screen.getByTestId('whatNext');
		const signInToActivate = screen.getByTestId('signInToActivate');
		expect(whatNext).toBeInTheDocument();
		expect(signInToActivate).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for Digital Edition users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="DigitalSubscription"
				ratePlanKey="Monthly"
				identityUserType="current"
			/>,
		);
		const signIn = screen.getByTestId('signIn');
		const appDownloadEditions = screen.getByTestId('appDownloadEditions');
		const socialShare = screen.getByTestId('socialShare');
		expect(signIn).toBeInTheDocument();
		expect(appDownloadEditions).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for Everyday NationalDelivery Paper users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="NationalDelivery"
				ratePlanKey="Everyday"
				identityUserType="current"
			/>,
		);
		const signIn = screen.getByTestId('signIn');
		const socialShare = screen.getByTestId('socialShare');
		expect(signIn).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for Everyday SubscriptionCard Paper users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="SubscriptionCard"
				ratePlanKey="Everyday"
				identityUserType="current"
			/>,
		);
		const signIn = screen.getByTestId('signIn');
		const socialShare = screen.getByTestId('socialShare');
		expect(signIn).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});

	it('should display the correct thankyou cards for Guardian Weekly Domestic users', () => {
		render(
			<ThankYouComponent
				{...defaultProps}
				productKey="GuardianWeeklyDomestic"
				ratePlanKey="Monthly"
				identityUserType="current"
			/>,
		);
		const signIn = screen.getByTestId('signIn');
		const socialShare = screen.getByTestId('socialShare');
		expect(signIn).toBeInTheDocument();
		expect(socialShare).toBeInTheDocument();
	});
});
