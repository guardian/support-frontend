import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgEnvelope,
	SvgFacebook,
	SvgLinkedIn,
	SvgTwitter,
} from '@guardian/source/react-components';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	OPHAN_COMPONENT_ID_SOCIAL_EMAIL,
	OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK,
	OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN,
	OPHAN_COMPONENT_ID_SOCIAL_TWITTER,
} from 'helpers/thankYouPages/utils/ophan';
import {
	getEmailShareLink,
	getFacebookShareLink,
	getLinkedInShareLink,
	getTwitterShareLink,
} from 'helpers/thankYouPages/utils/social';
import { trackComponentClick } from 'helpers/tracking/behaviour';

interface SocialShareIconsProps {
	countryId: IsoCountry;
	campaignCode?: string;
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
}: SocialShareIconsProps): JSX.Element {
	return (
		<div css={buttonsContainer}>
			<LinkButton
				href={getFacebookShareLink(campaignCode)}
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
				href={getTwitterShareLink(countryId, campaignCode)}
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
				href={getLinkedInShareLink()}
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
				href={getEmailShareLink(countryId, campaignCode)}
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
