import type { ContributionType } from 'helpers/contributions';

interface SubheadingProps {
	shouldShowLargeDonationMessage: boolean;
	contributionType: ContributionType;
	amountIsAboveThreshold: boolean;
}

function MarketingCopy() {
	return (
		<span>
			You can amend your email preferences at any time via{' '}
			<a href="https://manage.theguardian.com">your account</a>.
		</span>
	);
}

function Subheading({
	shouldShowLargeDonationMessage,
	contributionType,
	amountIsAboveThreshold,
}: SubheadingProps): JSX.Element {
	const subheadingCopy: Record<ContributionType, string> = {
		ONE_OFF: shouldShowLargeDonationMessage
			? 'It’s not every day we receive such a generous contribution – thank you. We’ll be in touch to bring you closer to our journalism. Please select the extra add-ons that suit you best. '
			: 'To support us further, and enhance your experience with the Guardian, select the add-ons that suit you best. As you’re now a valued supporter, we’ll be in touch to bring you closer to our journalism. ',
		MONTHLY: amountIsAboveThreshold
			? 'Look out for your exclusive newsletter from our supporter editor, and other ways to get the most out of your supporter experience. '
			: 'You have unlocked access to the Guardian’s digital subscription, offering you the best possible experience of our independent journalism. Look out for emails from us shortly, so you can activate your exclusive extras. In the meantime, please select the add-ons that suit you best.',
		ANNUAL: amountIsAboveThreshold
			? 'Look out for your exclusive newsletter from our supporter editor, and other ways to get the most out of your supporter experience. '
			: 'You have unlocked access to the Guardian’s digital subscription, offering you the best possible experience of our independent journalism. Look out for emails from us shortly, so you can activate your exclusive extras. In the meantime, please select the add-ons that suit you best.',
	};

	return (
		<>
			{subheadingCopy[contributionType]}
			{contributionType !== 'ONE_OFF' && <MarketingCopy />}
		</>
	);
}

export default Subheading;
