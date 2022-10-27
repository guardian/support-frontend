import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import {
	LinkButton,
	SvgEnvelope,
	SvgFacebook,
	SvgLinkedIn,
	SvgTwitter,
} from '@guardian/source-react-components';
import { generateReferralCode } from 'helpers/campaigns/campaignReferralCodes';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {
	OPHAN_COMPONENT_ID_SOCIAL_EMAIL,
	OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK,
	OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN,
	OPHAN_COMPONENT_ID_SOCIAL_TWITTER,
} from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';
import {
	getEmailShareLink,
	getFacebookShareLink,
	getLinkedInShareLink,
	getTwitterShareLink,
} from 'pages/contributions-landing/components/ContributionThankYou/utils/social';

interface SocialShareIconsProps {
	countryId: IsoCountry;
	campaignCode?: string;
	createReferralCodes: boolean;
	email: string;
}

const buttonsContainer = css`
	& > * + * {
		margin-left: ${space[3]}px;
	}
`;

const socialShareHeader = 'Share your support';

const getSocialShareCopy = (countryId: IsoCountry): string =>
	countryId === 'AU'
		? 'Your voice matters. By sharing a message of support for Guardian Australia, you can help us grow our community. ' +
		  'Together, we can make a difference.'
		: 'Invite your followers to support the Guardian’s open, independent reporting.';

function SocialShareIcons({
	countryId,
	campaignCode,
	createReferralCodes,
	email,
}: SocialShareIconsProps): JSX.Element {
	const referralCode =
		createReferralCodes && campaignCode
			? generateReferralCode(email, campaignCode)
			: null;

	return (
		<div css={buttonsContainer}>
			<LinkButton
				href={getFacebookShareLink(campaignCode, referralCode)}
				onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK)}
				target="_blank"
				rel="noopener noreferrer"
				priority="tertiary"
				size="default"
				icon={<SvgFacebook />}
				hideLabel
			>
				Facebook
			</LinkButton>

			<LinkButton
				href={getTwitterShareLink(countryId, campaignCode, referralCode)}
				onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_TWITTER)}
				target="_blank"
				rel="noopener noreferrer"
				priority="tertiary"
				size="default"
				icon={<SvgTwitter />}
				hideLabel
			>
				Twitter
			</LinkButton>

			<LinkButton
				href={getLinkedInShareLink(referralCode)}
				onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN)}
				target="_blank"
				rel="noopener noreferrer"
				priority="tertiary"
				size="default"
				icon={<SvgLinkedIn />}
				hideLabel
			>
				LinkedIn
			</LinkButton>

			<LinkButton
				href={getEmailShareLink(countryId, campaignCode, referralCode)}
				onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_EMAIL)}
				target="_blank"
				rel="noopener noreferrer"
				priority="tertiary"
				size="default"
				icon={<SvgEnvelope />}
				hideLabel
			>
				Email
			</LinkButton>
		</div>
	);
}

export { socialShareHeader, getSocialShareCopy, SocialShareIcons };
