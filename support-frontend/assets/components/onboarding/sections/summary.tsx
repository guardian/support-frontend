import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import {
	Button,
	Stack,
	SvgDirectDebit,
	SvgTickRound,
} from '@guardian/source/react-components';
import { ToggleSwitch } from '@guardian/source-development-kitchen/react-components';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { useState } from 'preact/hooks';
import { useEffect } from 'react';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import {
	getNewsletterSubscriptionById,
	NewslettersIds,
	type NewsletterSubscription,
	updateNewsletterSubscription,
} from 'helpers/identity/newsletters';
import { productLegal } from 'helpers/legalCopy';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { getThankYouOrder } from 'pages/[countryGroupId]/checkout/helpers/sessionStorage';
import type {
	CurrentUserState,
	HandleStepNavigationFunction,
	OnboardingProps,
} from 'pages/[countryGroupId]/components/onboardingComponent';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { getSupportRegionIdConfig } from 'pages/supportRegionConfig';
import ContentBox from '../contentBox';
import {
	benefitsItem,
	benefitsItemIcon,
	benefitsItemText,
	boldDescriptions,
	buttonOverrides,
	descriptions,
	headings,
	newsletterContainer,
	newslettersAppUsageInformation,
	paymentDetailsBox,
	separator,
} from './sectionsStyles';

const purchaseSummaryDetailsContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const purchaseSummaryDetailsPriceText = css`
	text-align: end;
	text-wrap: balance;
`;

const paymentMethodContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	gap: ${space[1]}px;
`;

const onboardingSummaryCopyMapping: Record<
	CurrentUserState,
	{ title: string; description: string }
> = {
	existingUserSignedIn: {
		title: "You're ready to go",
		description:
			"Find out what's included in your All-access digital subscription.",
	},
	userSignedIn: {
		title: 'You’re signed in',
		description: 'You can now explore your exclusive benefits.',
	},
	userRegistered: {
		title: 'Welcome to the Guardian',
		description:
			'Your account is set up and ready to go. Now you can explore your exclusive benefits.',
	},
};

export function OnboardingSummarySuccessfulSignIn({
	handleStepNavigation,
	userState,
	userNewslettersSubscriptions,
	csrf,
}: {
	handleStepNavigation: HandleStepNavigationFunction;
	userState: CurrentUserState;
	userNewslettersSubscriptions: NewsletterSubscription[] | null;
	csrf: CsrfState;
}) {
	/**
	 * Consider the Saturday Edition newsletter subscription as subscribed.
	 * Either the user has an active subscription or we will subscribe them automatically.
	 */
	const [switchNewsletterEnabled, setSwitchNewsletterEnabled] = useState(true);
	const [
		isUpdatingNewsletterSubscription,
		setIsUpdatingNewsletterSubscription,
	] = useState(false);

	useEffect(() => {
		if (userNewslettersSubscriptions) {
			// Find the Saturday Edition newsletter using the type-safe helper
			const saturdayEditionNewsletterSubscription =
				getNewsletterSubscriptionById(
					userNewslettersSubscriptions,
					NewslettersIds.SaturdayEdition,
				);

			if (!saturdayEditionNewsletterSubscription) {
				// If not found, default to subscribed (will be auto-subscribed)
				void handleNewsletterToggle(true);
			}
		}
	}, [userNewslettersSubscriptions]);

	const handleNewsletterToggle = async (newSubscribeState?: boolean) => {
		// Prevent multiple simultaneous requests
		if (isUpdatingNewsletterSubscription) {
			return;
		}
		setIsUpdatingNewsletterSubscription(true);

		const newState = newSubscribeState ?? !switchNewsletterEnabled;
		setSwitchNewsletterEnabled(newState);

		try {
			await updateNewsletterSubscription(
				csrf,
				NewslettersIds.SaturdayEdition,
				newState,
			);
		} catch (error) {
			console.error('Failed to update newsletter preference:', error);
			// Revert the toggle on error
			setSwitchNewsletterEnabled(!newState);
		} finally {
			// Always re-enable the toggle when request completes
			setIsUpdatingNewsletterSubscription(false);
		}
	};

	return (
		<Stack space={2}>
			<h1 css={headings}>{onboardingSummaryCopyMapping[userState].title}</h1>
			<p css={descriptions}>
				{onboardingSummaryCopyMapping[userState].description}
			</p>

			<Stack
				space={0}
				cssOverrides={css`
					margin-top: ${space[5]}px;
				`}
			>
				<Button
					priority="primary"
					cssOverrides={buttonOverrides}
					onClick={() => handleStepNavigation(OnboardingSteps.GuardianApp)}
				>
					Explore your benefits
				</Button>
				<Button
					priority="subdued"
					cssOverrides={buttonOverrides}
					onClick={() => handleStepNavigation(OnboardingSteps.Completed)}
				>
					Skip
				</Button>
			</Stack>

			<div css={newsletterContainer}>
				<Stack space={1}>
					<h2 css={boldDescriptions}>Saturday Edition newsletter</h2>
					<p css={descriptions}>
						An exclusive email highlighting the week’s best Guardian journalism
						from our editor-in-chief, Katharine Viner
					</p>
				</Stack>
				<ToggleSwitch
					checked={switchNewsletterEnabled}
					onClick={() => void handleNewsletterToggle()}
				/>
			</div>
		</Stack>
	);
}

function OnboardingSummary({
	productKey,
	landingPageSettings,
	supportRegionId,
	payment,
	ratePlanKey,
	promotion,
}: OnboardingProps) {
	const order = getThankYouOrder();
	const productSettings =
		productKey && landingPageSettings.products[productKey];
	const { windowWidthIsLessThan } = useWindowWidth();

	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);

	const amountPaidToday = simpleFormatAmount(
		getCurrencyInfo(currencyKey),
		payment.finalAmount,
	);

	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const fullAmount = `${amountPaidToday}/${periodNoun}`;
	let promoMessage = '';

	if (promotion) {
		promoMessage =
			productLegal(
				countryGroupId,
				billingPeriod,
				' per ',
				payment.originalAmount,
				promotion,
			) + ' thereafter';
	}

	const nextPaymentDate = new Date();
	if (billingPeriod === BillingPeriod.Monthly) {
		nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
	} else if (billingPeriod === BillingPeriod.Annual) {
		nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
	} else if (billingPeriod === BillingPeriod.Quarterly) {
		nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
	}

	const isDirectDebit =
		order?.paymentMethod === 'DirectDebit' || order?.paymentMethod === 'Sepa';
	const isPaypal = order?.paymentMethod === 'PayPal';
	const isStripeCard =
		order?.paymentMethod === 'Stripe' ||
		order?.paymentMethod === 'StripeExpressCheckoutElement' ||
		order?.paymentMethod === 'StripeHostedCheckout';

	const paymentMethodCopy = isDirectDebit
		? 'Direct Debit'
		: isPaypal
		? 'PayPal'
		: isStripeCard
		? 'Credit/Debit card'
		: 'Your selected payment method';

	const paymentMethod =
		order?.accountNumber && isDirectDebit
			? `ending ${order.accountNumber}`
			: paymentMethodCopy;

	const emailWithSoftHyphen = (order?.email ?? 'your email address').replace(
		'@',
		'\u00AD@',
	);

	return (
		<Stack
			space={5}
			cssOverrides={css`
				margin-top: ${space[5]}px;
			`}
		>
			<ContentBox>
				<Stack space={2}>
					<h1 css={headings}>Purchase summary</h1>
					<p css={descriptions}>
						{`Thanks for your payment. We've sent a payment confirmation email to
                    `}
					</p>
					<span css={boldDescriptions}>{emailWithSoftHyphen}.</span>

					<Stack space={2} cssOverrides={paymentDetailsBox}>
						<p css={boldDescriptions}>Payment details</p>
						<div css={separator} />
						<Stack space={2}>
							<div css={purchaseSummaryDetailsContainer}>
								<p css={boldDescriptions}>Product</p>
								<p css={descriptions}>{productSettings?.title}</p>
							</div>
							<div css={purchaseSummaryDetailsContainer}>
								<p css={boldDescriptions}>Price</p>
								<p css={[descriptions, purchaseSummaryDetailsPriceText]}>
									{promoMessage || fullAmount}
								</p>
							</div>
							<div css={purchaseSummaryDetailsContainer}>
								<p css={boldDescriptions}>Payment method</p>
								<div css={paymentMethodContainer}>
									{isDirectDebit && <SvgDirectDebit size="medium" />}
									<p css={descriptions}>{paymentMethod}</p>
								</div>
							</div>
						</Stack>
						{isDirectDebit && (
							<>
								<div css={separator} />
								<span css={boldDescriptions}>
									Your Direct Debit has been set up.{' '}
								</span>
								<span css={descriptions}>
									You will receive an email within three business days
									confirming your recurring payment. This will appear as
									'Guardian' on your bank statements.
								</span>
							</>
						)}
					</Stack>
				</Stack>
			</ContentBox>

			<ContentBox>
				<Stack space={2}>
					<h1 css={headings}>Your benefits</h1>
					<div css={separator} />
					<ul>
						{productSettings?.benefits.map((benefit) => (
							<li
								css={benefitsItem}
								key={`onboarding-summary-benefit-${benefit.copy}`}
							>
								<div css={benefitsItemIcon}>
									<SvgTickRound
										isAnnouncedByScreenReader
										size={windowWidthIsLessThan('desktop') ? 'small' : 'medium'}
										theme={{ fill: palette.brand[500] }}
									/>
								</div>
								<span css={benefitsItemText}>{benefit.copy}</span>
							</li>
						))}
					</ul>
				</Stack>
			</ContentBox>
			<p css={newslettersAppUsageInformation}>
				Keep an eye out for your exclusive newsletters from our editors. You can
				manage your preferences at any time by signing into your Guardian
				account to update your settings.
			</p>
		</Stack>
	);
}

export default OnboardingSummary;
