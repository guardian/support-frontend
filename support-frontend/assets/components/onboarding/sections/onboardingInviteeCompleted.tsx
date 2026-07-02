import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import {
	LinkButton,
	Stack,
	SvgTickRound,
} from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import GridImage from 'components/gridImage/gridImage';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { OnboardingInviteeInvitation } from 'helpers/onboardingInvitee/invitation';
import { getHelpCentreUrl, getManageSubsUrl } from 'helpers/urls/externalLinks';
import { getBaseDomain } from 'helpers/urls/url';
import { getBenefitsChecklistFromLandingPageTool } from 'pages/[countryGroupId]/checkout/helpers/benefitsChecklist';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { getSupportRegionIdConfig } from 'pages/supportRegionConfig';
import ContentBox from '../contentBox';
import {
	benefitsItem,
	benefitsItemIcon,
	benefitsItemText,
	buttonOverrides,
	completedStack,
	descriptions,
	headings,
	heroContainer,
	newslettersAppUsageInformation,
	separator,
} from './sectionsStyles';

const heroAspectRatio = css`
	aspect-ratio: 21 / 9;
`;

const linkStyle = css`
	color: ${palette.brand[500]};
	text-decoration: underline;
`;

const completedStackPadding = css`
	padding: ${space[3]}px;

	${from.tablet} {
		padding: ${space[8]}px;
		padding-top: ${space[3]}px;
	}
`;

export function OnboardingInviteeCompleted({
	invitation,
	landingPageSettings,
	supportRegionId,
}: {
	invitation: OnboardingInviteeInvitation;
	landingPageSettings: LandingPageVariant;
	supportRegionId: SupportRegionId;
}) {
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);

	const benefitsChecklist =
		getBenefitsChecklistFromLandingPageTool(
			'DigitalSubscription',
			landingPageSettings,
			countryGroupId,
		) ?? [];

	const { windowWidthIsLessThan } = useWindowWidth();

	return (
		<Stack space={5} cssOverrides={completedStack}>
			<ContentBox removePadding>
				<div css={[heroContainer, heroAspectRatio]}>
					<GridImage
						gridId="onboardingCompletedHero"
						srcSizes={[2000, 1000, 500]}
						sizes="(max-width: 739px) 140px, 422px"
						imgType="png"
						altText="Onboarding completed hero"
					/>
				</div>

				<Stack space={5} cssOverrides={completedStackPadding}>
					<div css={separator} />
					<Stack space={2}>
						<h1 css={headings}>Start reading the Guardian</h1>
						<p css={descriptions}>
							In a world increasingly shaped by disinformation and division, the
							Guardian&apos;s trusted journalism stands as a powerful
							counterforce.
						</p>
						<p css={descriptions}>
							You&apos;ve joined {invitation.inviterFirstName}&apos;s
							subscription and have access to:
						</p>
					</Stack>
					<ul>
						{benefitsChecklist.map((benefit) => (
							<li
								css={benefitsItem}
								key={`onboarding-invitee-benefit-${benefit.text as string}`}
							>
								<div css={benefitsItemIcon}>
									<SvgTickRound
										isAnnouncedByScreenReader
										size={windowWidthIsLessThan('desktop') ? 'small' : 'medium'}
										theme={{ fill: palette.brand[500] }}
									/>
								</div>
								<span css={benefitsItemText}>{benefit.text}</span>
							</li>
						))}
					</ul>
					<LinkButton
						priority="primary"
						cssOverrides={[buttonOverrides]}
						href={`https://${getBaseDomain()}`}
					>
						Continue to the Guardian
					</LinkButton>
				</Stack>
			</ContentBox>
			<p css={newslettersAppUsageInformation}>
				Need help? Visit our{' '}
				<a href={getHelpCentreUrl()} css={linkStyle}>
					Help Centre
				</a>{' '}
				to find the FAQs and contact options. You can manage your subscription
				anytime in{' '}
				<a href={getManageSubsUrl()} css={linkStyle}>
					Manage my account
				</a>
				.
			</p>
		</Stack>
	);
}
