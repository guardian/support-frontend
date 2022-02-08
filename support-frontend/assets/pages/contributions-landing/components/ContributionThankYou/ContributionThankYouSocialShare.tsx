import { css } from '@emotion/react';
import { LinkButton } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { SvgEnvelope, SvgFacebook, SvgTwitter } from '@guardian/src-icons';
import { useEffect } from 'react';
import * as React from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import { generateReferralCode } from '../../../../helpers/campaigns/campaignReferralCodes';
import ActionBody from './components/ActionBody';
import ActionContainer from './components/ActionContainer';
import ActionHeader from './components/ActionHeader';
import SvgLinkedIn from './components/SvgLinkedIn';
import SvgShare from './components/SvgShare';
import {
	OPHAN_COMPONENT_ID_SOCIAL,
	OPHAN_COMPONENT_ID_SOCIAL_EMAIL,
	OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK,
	OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN,
	OPHAN_COMPONENT_ID_SOCIAL_TWITTER,
} from './utils/ophan';
import {
	getEmailShareLink,
	getFacebookShareLink,
	getLinkedInShareLink,
	getTwitterShareLink,
} from './utils/social';

const buttonsContainer = css`
	margin-top: ${space[6]}px;

	& > * + * {
		margin-left: ${space[3]}px;
	}
`;

type ContributionThankYouSocialShareProps = {
	email: string;
	createReferralCodes: boolean;
	campaignCode: string | null | undefined;
	countryId: IsoCountry;
};

const ContributionThankYouSocialShare: React.FC<ContributionThankYouSocialShareProps> =
	({
		email,
		createReferralCodes,
		campaignCode,
		countryId,
	}: ContributionThankYouSocialShareProps) => {
		useEffect(() => {
			trackComponentLoad(OPHAN_COMPONENT_ID_SOCIAL);
		}, []);

		const referralCode =
			createReferralCodes && campaignCode
				? generateReferralCode(email, campaignCode)
				: null;

		const copy =
			countryId === 'AU'
				? 'Your voice matters. By sharing a message of support for Guardian Australia, you can help us grow our community. ' +
				  'Together, we can make a difference.'
				: 'Invite your followers to support the Guardian’s open, independent reporting.';

		const actionIcon = <SvgShare />;
		const actionHeader = <ActionHeader title="Share your support" />;
		const actionBody = (
			<ActionBody>
				<p>{copy}</p>
				<div css={buttonsContainer}>
					<LinkButton
						href={getFacebookShareLink(campaignCode, referralCode)}
						onClick={() =>
							trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK)
						}
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
						onClick={() =>
							trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_TWITTER)
						}
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
						onClick={() =>
							trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN)
						}
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
			</ActionBody>
		);
		return (
			<ActionContainer
				icon={actionIcon}
				header={actionHeader}
				body={actionBody}
			/>
		);
	};

export default ContributionThankYouSocialShare;
