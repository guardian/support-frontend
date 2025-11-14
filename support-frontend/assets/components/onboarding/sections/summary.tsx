import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import {
	Button,
	Stack,
	SvgDirectDebit,
	SvgTickRound,
} from '@guardian/source/react-components';
import { ToggleSwitch } from '@guardian/source-development-kitchen/react-components';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { useState } from 'preact/hooks';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import { getThankYouOrder } from 'pages/[countryGroupId]/checkout/helpers/sessionStorage';
import type {
	HandleStepNavigationFunction,
	OnboardingProps,
} from 'pages/[countryGroupId]/components/onboardingComponent';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
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
	paymentDetailsContainer,
	separator,
} from './sectionsStyles';

const purchaseSummaryDetailsContainer = css`
	text-align: end;
`;

const paymentMethodContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	gap: ${space[1]}px;
`;

export function OnboardingSummarySuccessfulSignIn({
	handleStepNavigation,
}: {
	handleStepNavigation: HandleStepNavigationFunction;
}) {
	const [switchNewsletterEnabled, setSwitchNewsletterEnabled] = useState(true);

	return (
		<Stack space={2}>
			<h1 css={headings}>Welcome to the Guardian</h1>
			<p css={descriptions}>
				Your account is set up and ready to go. Now you can explore your
				exclusive benefits.
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
					onClick={() => setSwitchNewsletterEnabled(!switchNewsletterEnabled)}
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
}: OnboardingProps) {
	const order = getThankYouOrder();
	const productSettings =
		productKey && landingPageSettings.products[productKey];

	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);
	const currency = currencies[currencyKey];
	const amountPaidToday = simpleFormatAmount(currency, payment.finalAmount);

	const billingPeriod = ratePlanKey
		? ratePlanToBillingPeriod(ratePlanKey)
		: undefined;
	const periodNoun = billingPeriod ? getBillingPeriodNoun(billingPeriod) : '';
	const fullAmount = `${amountPaidToday}/${periodNoun}`;

	const nextPaymentDate = new Date();
	if (billingPeriod === BillingPeriod.Monthly) {
		nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
	} else if (billingPeriod === BillingPeriod.Annual) {
		nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
	} else if (billingPeriod === BillingPeriod.Quarterly) {
		nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
	}

	const isDirectDebit = order?.paymentMethod === 'DirectDebit';
	const isPaypal = order?.paymentMethod === 'PayPal';
	const paymentMethodCopy = isDirectDebit
		? 'Direct Debit'
		: isPaypal
		? 'PayPal'
		: 'Credit/Debit card';
	const paymentMethod =
		order?.accountNumber && isDirectDebit
			? order.accountNumber
			: paymentMethodCopy;

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
						{`Thanks for your payment. We’ve sent a payment confirmation email to
                    ${order?.email ?? 'your email address'}.`}
					</p>

					<Stack space={2} cssOverrides={paymentDetailsBox}>
						<p css={boldDescriptions}>Payment details</p>
						<div css={separator} />
						<div css={paymentDetailsContainer}>
							<Stack space={2}>
								<p css={boldDescriptions}>Product</p>
								<p css={boldDescriptions}>Price</p>
								<p css={boldDescriptions}>Payment method</p>
							</Stack>
							<Stack space={2} cssOverrides={purchaseSummaryDetailsContainer}>
								<p css={descriptions}>{productSettings?.title}</p>
								<p css={descriptions}>{fullAmount}</p>
								<div css={paymentMethodContainer}>
									{isDirectDebit && <SvgDirectDebit size="medium" />}
									<p css={descriptions}>{paymentMethod}</p>
								</div>
							</Stack>
						</div>
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
										size="medium"
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
