import { SupportRegionId } from '@guardian/support-service-lambdas/modules/internationalisation/src/countryGroup';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import { TEST_ID_PREFIX } from 'components/thankYou/thankYouModule';
import * as userModule from 'helpers/user/user';
import { fallBackLandingPageSelection } from '../../../../helpers/abTests/landingPageAbTests';
import {
	type CheckoutComponentProps,
	ThankYouComponent,
} from '../thankYouComponent';

jest.mock('pages/aus-moment-map/hooks/useWindowWidth', () => ({
	useWindowWidth: () => ({
		windowWidthIsGreaterThan: () => true,
	}),
}));
jest.mock('../../checkout/helpers/sessionStorage', () => ({
	getThankYouOrder: () => 'order',
	getReturnAddress: () => 'adress',
}));

const defaultProps: CheckoutComponentProps = {
	supportRegionId: SupportRegionId.UK,
	csrf: { token: 'token' },
	payment: {
		originalAmount: 12,
		finalAmount: 12,
	},
	identityUserType: 'current',
	abParticipations: {},
	landingPageSettings: fallBackLandingPageSelection,
};

function testComponent(
	props: Partial<CheckoutComponentProps>,
	thankYouModules: ThankYouModuleType[],
) {
	const { container } = render(
		<ThankYouComponent {...defaultProps} {...props} />,
	);
	const thankYouNodes = container.querySelectorAll(
		`[data-testid^="${TEST_ID_PREFIX}-"]`,
	);

	thankYouModules.forEach((tyModule) => {
		const testId = `${TEST_ID_PREFIX}-${tyModule}`;
		expect(screen.getByTestId(testId)).toBeInTheDocument();
	});
	expect(thankYouNodes).toHaveLength(thankYouModules.length);
}

describe('thankYouComponent', () => {
	describe('if Guest user', () => {
		it('should display the correct thankyou cards for One time contribution', () => {
			testComponent({ identityUserType: 'new' }, [
				'feedback',
				'signUp',
				'supportReminder',
				'socialShare',
			]);
		});

		it('should display the correct thankyou cards for Recurring Contribution', () => {
			testComponent(
				{
					productKey: 'Contribution',
					ratePlanKey: 'Monthly',
					identityUserType: 'new',
				},
				['signUp', 'socialShare'],
			);
		});

		it('should display the correct thankyou cards for GuardianWeeklyDomestic', () => {
			testComponent(
				{
					productKey: 'GuardianWeeklyDomestic',
					ratePlanKey: 'Monthly',
					identityUserType: 'new',
				},
				['signUp', 'whatNext'],
			);
		});

		it('should display the correct thankyou cards for HomeDelivery', () => {
			testComponent(
				{
					productKey: 'HomeDelivery',
					ratePlanKey: 'Everyday',
					identityUserType: 'new',
				},
				['signUp', 'whatNext', 'appsDownload'],
			);
		});

		it('should display the correct thankyou cards for SubscriptionCard', () => {
			testComponent(
				{
					productKey: 'SubscriptionCard',
					ratePlanKey: 'Everyday',
					identityUserType: 'new',
				},
				['signUp', 'whatNext', 'appsDownload'],
			);
		});

		it('should display the correct thankyou cards for Observer', () => {
			testComponent(
				{
					productKey: 'SubscriptionCard',
					ratePlanKey: 'Sunday',
					identityUserType: 'new',
				},
				['signUp', 'whatNext', 'observerAppDownload'],
			);
		});
	});

	describe('if signedIn user', () => {
		const getUserSpy = jest.spyOn(userModule, 'getUser');

		beforeEach(() => {
			getUserSpy.mockImplementation(() => ({ isSignedIn: true }));
		});

		afterAll(() => {
			getUserSpy.mockRestore();
		});

		it('should display the correct thankyou cards for One time contribution', () => {
			testComponent({}, ['feedback', 'supportReminder', 'socialShare']);
		});

		it('should display the correct thankyou cards for Recurring Contribution', () => {
			testComponent({ productKey: 'Contribution', ratePlanKey: 'Monthly' }, [
				'socialShare',
				'feedback',
			]);
		});

		it('should display the correct thankyou cards for GuardianWeeklyDomestic', () => {
			testComponent(
				{ productKey: 'GuardianWeeklyDomestic', ratePlanKey: 'Monthly' },
				['whatNext'],
			);
		});

		it('should display the correct thankyou cards for HomeDelivery', () => {
			testComponent({ productKey: 'HomeDelivery', ratePlanKey: 'Everyday' }, [
				'whatNext',
				'appsDownload',
			]);
		});

		it('should display the correct thankyou cards for SubscriptionCard', () => {
			testComponent(
				{ productKey: 'SubscriptionCard', ratePlanKey: 'Everyday' },
				['whatNext', 'appsDownload'],
			);
		});

		it('should display the correct thankyou cards for Observer', () => {
			testComponent({ productKey: 'SubscriptionCard', ratePlanKey: 'Sunday' }, [
				'whatNext',
				'observerAppDownload',
			]);
		});
	});

	describe('if user not signedIn', () => {
		it('should display the correct thankyou cards for Recurring Contribution', () => {
			testComponent({ productKey: 'Contribution', ratePlanKey: 'Monthly' }, [
				'signIn',
				'socialShare',
			]);
		});

		it('should display the correct thankyou cards for SupporterPlus', () => {
			testComponent({ productKey: 'SupporterPlus', ratePlanKey: 'Monthly' }, [
				'signIn',
				'appsDownload',
				'socialShare',
			]);
		});

		it('should display the correct thankyou cards for TierThree', () => {
			testComponent({ productKey: 'TierThree', ratePlanKey: 'Monthly' }, [
				'signIn',
				'benefits',
				'appsDownload',
				'subscriptionStart',
			]);
		});

		it('should display the correct thankyou cards for Guardian AdLite', () => {
			testComponent({ productKey: 'GuardianAdLite', ratePlanKey: 'Monthly' }, [
				'whatNext',
				'signInToActivate',
			]);
		});

		it('should display the correct thankyou cards for Digital Edition', () => {
			testComponent(
				{ productKey: 'DigitalSubscription', ratePlanKey: 'Monthly' },
				['signIn', 'appDownloadEditions', 'socialShare'],
			);
		});

		it.skip('should display the correct thankyou cards for Everyday NationalDelivery Paper', () => {
			testComponent(
				{ productKey: 'NationalDelivery', ratePlanKey: 'Everyday' },
				['subscriptionStart'],
			);
		});

		it('should display the correct thankyou cards for Everyday SubscriptionCard Paper', () => {
			testComponent(
				{ productKey: 'SubscriptionCard', ratePlanKey: 'Everyday' },
				['signIn', 'whatNext', 'appsDownload'],
			);
		});

		it('should display the correct thankyou cards for GuardianWeeklyDomestic', () => {
			testComponent(
				{ productKey: 'GuardianWeeklyDomestic', ratePlanKey: 'Monthly' },
				['signIn', 'whatNext'],
			);
		});

		it('should display the correct thankyou cards for HomeDelivery', () => {
			testComponent({ productKey: 'HomeDelivery', ratePlanKey: 'Everyday' }, [
				'signIn',
				'whatNext',
				'appsDownload',
			]);
		});

		it('should display the correct thankyou cards for SubscriptionCard', () => {
			testComponent(
				{ productKey: 'SubscriptionCard', ratePlanKey: 'Everyday' },
				['signIn', 'whatNext', 'appsDownload'],
			);
		});

		it('should display the correct thankyou cards for Observer', () => {
			testComponent({ productKey: 'SubscriptionCard', ratePlanKey: 'Sunday' }, [
				'signIn',
				'whatNext',
				'observerAppDownload',
			]);
		});
	});
});
