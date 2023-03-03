import type { ContributionType } from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import DirectDebitMessage from 'pages/supporter-plus-thank-you/components/thankYouHeader/directDebitMessage';
import {
	header,
	headerSupportingText,
	headerTitleText,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';
import Heading from './heading';
import Subheading from './subheading';

type ThankYouHeaderProps = {
	name: string | null;
	showDirectDebitMessage: boolean;
	amount: number | undefined;
	contributionType: ContributionType;
	currency: IsoCurrency;

	// Props needed for the Subheading component - currently unused
	//
	// amountIsAboveSupporterPlusThreshold: boolean;
	// isSignedIn: boolean;
	// userTypeFromIdentityResponse: UserTypeFromIdentityResponse;
};

function ThankYouHeader({
	name,
	showDirectDebitMessage,
	amount,
	contributionType,
	currency,
}: ThankYouHeaderProps): JSX.Element {
	return (
		<header css={header}>
			<h1 css={headerTitleText}>
				<Heading
					name={name}
					amount={amount}
					contributionType={contributionType}
					currency={currency}
				/>
			</h1>
			<p css={headerSupportingText}>
				{showDirectDebitMessage && <DirectDebitMessage />}
				<Subheading />
			</p>
		</header>
	);
}

export default ThankYouHeader;
