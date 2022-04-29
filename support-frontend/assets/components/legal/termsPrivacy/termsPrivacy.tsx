// ----- Imports ----- //
import type { ReactElement } from 'react';
import type { CampaignSettings } from 'helpers/campaigns/campaigns';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import {
	contributionsTermsLinks,
	philanthropyContactEmail,
	privacyLink,
} from 'helpers/legal';
import './termsPrivacy.scss';
// ---- Types ----- //
type PropTypes = {
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
	campaignSettings: CampaignSettings | null;
	amount: number;
	currency: IsoCurrency;
	showBenefitsMessaging: boolean;
};

// ----- Component ----- //
function TermsPrivacy(props: PropTypes): ReactElement {
	const terms = props.showBenefitsMessaging ? (
		<a href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
			Terms and Conditions
		</a>
	) : (
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

	const americasContactLink = (
		<a href="mailto:us.philanthropy@theguardian.com">contact us</a>
	);

	const customerQueriesLink = (
		<a href="https://manage.theguardian.com/help-centre">go here</a>
	);

	const patronText = (
		<div className="patrons">
			<h4>Guardian Patrons programme</h4>
			<p>
				If you would like to support us at a higher level, from{' '}
				{getRegionalAmountString()} a month, you can join us as a Guardian
				Patron. {patronsLink}
			</p>
			<br />
		</div>
	);

	const patronAndPhilanthropicAskText = (
		<div>
			<div className="horizontalRule" />
			<div className="philanthropic-ask">
				<h4>Contribute another way</h4>
				<p>
					To contribute by mail, please make your check payable to:
					<br />
					Guardian News
					<br />
					Church Street Station
					<br />
					PO Box 3403
					<br />
					New York, NY 10008-3403.
				</p>
				<p>
					Please {americasContactLink} if you would like to: make a larger
					single contribution as an individual, contribute as a company or
					foundation, learn about options for tax-exempt support or would like
					to discuss legacy gifting.
				</p>
				<p>
					To contribute at a higher level on a recurring basis, you can join as
					a Guardian Patron. {patronsLink}.
				</p>
				<p>Thank you for your generosity.</p>
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

	return (
		<>
			<div className="component-terms-privacy">
				<div className="component-terms-privacy__terms">
					By proceeding, you are agreeing to our {terms}. To find out what
					personal data we collect and how we use it, please visit our {privacy}
					.
				</div>
			</div>
			<br />
			<div>{isUSContributor ? patronAndPhilanthropicAskText : patronText}</div>
			<div>
				{isUSContributor && (
					<div className="customer-support-contact">
						For regular customer queries, {customerQueriesLink}.
					</div>
				)}
			</div>
		</>
	);
} // ----- Exports ----- //

export default TermsPrivacy;
