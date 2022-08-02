// ----- Imports ----- //
import type { ReactElement } from 'react';
import type { CampaignSettings } from 'helpers/campaigns/campaigns';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import {
	contributionsTermsLinks,
	philanthropyContactEmail,
	privacyLink,
} from 'helpers/legal';
import './termsPrivacy.scss';
import {
	getDateWithOrdinal,
	getLongMonth,
} from 'helpers/utilities/dateFormatting';
// ---- Types ----- //
type PropTypes = {
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	campaignSettings: CampaignSettings | null;
	amount: number;
	currency: IsoCurrency;
	userInNewProductTest: boolean;
};

// ----- Component ----- //
function TermsPrivacy(props: PropTypes): ReactElement {
	const terms = (
		<a href={contributionsTermsLinks[props.countryGroupId]}>
			Terms and Conditions
		</a>
	);
	const privacy = <a href={privacyLink}>Privacy Policy</a>;

	const gbpAmount = 100;

	const regionalAmount = (
		isoCurrency: IsoCurrency,
	): number | null | undefined => {
		switch (isoCurrency) {
			case 'GBP':
				return gbpAmount;

			case 'USD':
				return 135;

			case 'EUR':
				return 117;

			case 'AUD':
				return 185;

			case 'CAD':
				return 167;

			case 'NZD':
				return 200;

			default:
				return null;
		}
	};

	const getRegionalAmountString = (): string => {
		const regionalPatronageAmount = regionalAmount(props.currency) ?? gbpAmount;
		return `${currencies[props.currency].glyph}${regionalPatronageAmount}`;
	};

	const patronsLink = (
		<a href="https://patrons.theguardian.com/join?INTCMP=gdnwb_copts_support_contributions_referral">
			Find out more today
		</a>
	);

	const philanthropyHelpLink = (
		<a href="https://manage.theguardian.com/help-centre/article/contribute-another-way">
			help page
		</a>
	);

	const patronText = (
		<div className="patrons">
			<h4>Guardian Patrons programme</h4>
			<p>
				If you would like to support us at a higher level, from{' '}
				{getRegionalAmountString()} a month, you can join us as a Guardian
				Patron. {patronsLink}
			</p>
		</div>
	);

	const patronAndPhilanthropicAskText = (
		<div>
			<div className="philanthropic-ask">
				<p>
					To learn more about other ways to support the Guardian, including
					checks and tax-exempt options, please visit our {philanthropyHelpLink}{' '}
					on this topic.
				</p>
			</div>
		</div>
	);

	if (props.campaignSettings?.termsAndConditions) {
		return props.campaignSettings.termsAndConditions(
			contributionsTermsLinks[props.countryGroupId],
			philanthropyContactEmail[props.countryGroupId],
		);
	}

	const isUSContributor = props.countryGroupId === 'UnitedStates';

	const recurringCopy = () => {
		if (Number.isNaN(props.amount)) {
			return '';
		}

		const now = new Date();
		const closestDayCopy =
			now.getDate() >= 29 ? ', or closest day thereafter' : '';
		const amountCopy = formatAmount(
			currencies[props.currency],
			spokenCurrencies[props.currency],
			props.amount,
			false,
		);

		if (props.contributionType === 'MONTHLY') {
			return `We will attempt to take payment of ${amountCopy}, on the ${getDateWithOrdinal(
				now,
			)} day of every month${closestDayCopy}, from now on until you cancel your contribution. Payments may take up to 6 days to be recorded in your bank account.`;
		}

		return `We will attempt to take payment of ${amountCopy} on the ${getDateWithOrdinal(
			now,
		)} day of ${getLongMonth(
			now,
		)} every year, from now until you cancel your contribution. Payments may take up to 6 days to be recorded in your bank account.`;
	};

	return (
		<>
			<div className="component-terms-privacy">
				{props.contributionType !== 'ONE_OFF' && !props.userInNewProductTest && (
					<div className="component-terms-privacy__change">
						{recurringCopy()}{' '}
						<strong>
							You can change how much you give or cancel your contributions at
							any time.
						</strong>
					</div>
				)}
				<div className="component-terms-privacy__terms">
					By proceeding, you are agreeing to our {terms}. To find out what
					personal data we collect and how we use it, please visit our {privacy}
					.
				</div>
			</div>
			<br />
			<div className="other-support-container">
				{isUSContributor ? patronAndPhilanthropicAskText : patronText}
			</div>
		</>
	);
} // ----- Exports ----- //

export default TermsPrivacy;
