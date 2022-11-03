import { css } from '@emotion/react';
import type { ContributionType } from 'helpers/contributions';
import type { UserTypeFromIdentityResponse } from 'helpers/identityApis';

interface SubheadingProps {
	shouldShowLargeDonationMessage: boolean;
	contributionType: ContributionType;
	amountIsAboveThreshold: boolean;
	isSignedIn: boolean;
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
}

function MarketingCopy({
	contributionType,
}: {
	contributionType: ContributionType;
}) {
	return contributionType === 'ONE_OFF' ? (
		<span>
			You can amend your email preferences at any time via{' '}
			<a href="https://manage.theguardian.com">your account</a>.
		</span>
	) : (
		<span>
			Adjust your email preferences at any time via{' '}
			<a href="https://manage.theguardian.com">your account</a>.
		</span>
	);
}

const getSubHeadingCopy = (
	shouldShowLargeDonationMessage: boolean,
	amountIsAboveThreshold: boolean,
	contributionType: ContributionType,
	isSignedIn: boolean,
	userTypeFromIdentityResponse: UserTypeFromIdentityResponse,
) => {
	const recurringCopy = (amountIsAboveThreshold: boolean) => {
		return {
			isSignedIn: amountIsAboveThreshold ? (
				<>
					<span
						css={css`
							font-weight: bold;
						`}
					>
						You have unlocked your exclusive supporter extras – we hope you
						enjoy them.
					</span>{' '}
					<span>
						Look out for your exclusive newsletter from our supporter editor.
						We’ll also be in touch with other great ways to get closer to
						Guardian journalism.{' '}
					</span>
				</>
			) : (
				<span>
					Look out for your exclusive newsletter from our supporter editor.
					We’ll also be in touch with other great ways to get closer to Guardian
					journalism.{' '}
				</span>
			),
			notSignedIn: amountIsAboveThreshold ? (
				<span>
					Look out for your exclusive newsletter from our supporter editor.
					We’ll also be in touch with other great ways to get closer to Guardian
					journalism.{' '}
				</span>
			) : (
				<span>
					Look out for your exclusive newsletter from our supporter editor.
					We’ll also be in touch with other great ways to get closer to Guardian
					journalism.{' '}
				</span>
			),
		};
	};

	const oneOffCopy = shouldShowLargeDonationMessage
		? 'It’s not every day we receive such a generous amount. We would love to stay in touch. So that we can, please select the add-ons that suit you best. '
		: 'We would love to stay in touch. So that we can, please select the add-ons that suit you best. ';

	return contributionType === 'ONE_OFF'
		? oneOffCopy
		: recurringCopy(amountIsAboveThreshold)[
				userTypeFromIdentityResponse === 'current' || isSignedIn
					? 'isSignedIn'
					: 'notSignedIn'
		  ];
};

function Subheading({
	shouldShowLargeDonationMessage,
	contributionType,
	amountIsAboveThreshold,
	isSignedIn,
	userTypeFromIdentityResponse,
}: SubheadingProps): JSX.Element {
	const subheadingCopy = getSubHeadingCopy(
		shouldShowLargeDonationMessage,
		amountIsAboveThreshold,
		contributionType,
		isSignedIn,
		userTypeFromIdentityResponse,
	);

	return (
		<>
			{subheadingCopy}
			{contributionType !== 'ONE_OFF' && (
				<MarketingCopy contributionType={contributionType} />
			)}
			{userTypeFromIdentityResponse !== 'current' &&
				contributionType !== 'ONE_OFF' && (
					<span
						css={css`
							font-weight: bold;
						`}
					>
						{' '}
						In the meantime, please sign in to get the best supporter
						experience.
					</span>
				)}
		</>
	);
}

export default Subheading;
