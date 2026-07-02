import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import { Button, Stack, SvgTickRound } from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import GridImage from 'components/gridImage/gridImage';
import { OnboardingDeclineSteps } from 'components/onboarding/onboardingSteps';
import type { HandleStepNavigationFunction } from 'components/onboarding/onboardingTypes';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
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
	separator,
} from './sectionsStyles';

const heroAspectRatio = css`
	aspect-ratio: 16 / 9;

	${from.tablet} {
		aspect-ratio: 20 / 9;
	}
`;

const contentPadding = css`
	padding: ${space[3]}px;

	${from.tablet} {
		padding: ${space[8]}px;
		padding-top: ${space[3]}px;
	}
`;

export function OnboardingDeclineInvitation({
	supportRegionId,
	landingPageSettings,
	handleStepNavigation,
}: {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
	handleStepNavigation: HandleStepNavigationFunction;
}) {
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);
	const { windowWidthIsLessThan } = useWindowWidth();

	const benefitsChecklist =
		getBenefitsChecklistFromLandingPageTool(
			'DigitalSubscription',
			landingPageSettings,
			countryGroupId,
		) ?? [];

	return (
		<Stack space={5} cssOverrides={completedStack}>
			<ContentBox
				removePadding
				cssOverrides={css`
					margin-bottom: ${space[10]}px;
				`}
			>
				<div css={[heroContainer, heroAspectRatio]}>
					<GridImage
						gridId="onboardingInviteeCreateAccountHero"
						srcSizes={[442]}
						sizes="442px"
						imgType="png"
						altText="Decline invitation hero"
					/>
				</div>

				<Stack space={5} cssOverrides={contentPadding}>
					<div css={separator} />
					<Stack space={2}>
						<h1 css={headings}>Decline invitation?</h1>
						<p css={descriptions}>
							You have been invited to join a Digital plus subscription.
						</p>
						<p css={descriptions}>
							If you decline this invitation, you won&apos;t be able to access
							premium digital plus benefits such as:
						</p>
					</Stack>
					<ul>
						{benefitsChecklist.map((benefit) => (
							<li
								css={benefitsItem}
								key={`onboarding-decline-benefit-${benefit.text as string}`}
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
					<Stack space={2}>
						<p css={descriptions}>
							You won&apos;t receive any further emails about this invitation.
						</p>
						<p css={descriptions}>
							You can still subscribe independently at any time.
						</p>
					</Stack>
					<Stack space={5}>
						<Button
							priority="primary"
							cssOverrides={buttonOverrides}
							onClick={() =>
								handleStepNavigation(OnboardingDeclineSteps.Declined)
							}
						>
							Confirm decline invitation
						</Button>
						<Button
							priority="tertiary"
							cssOverrides={buttonOverrides}
							onClick={() => handleStepNavigation(OnboardingDeclineSteps.Save)}
						>
							Cancel
						</Button>
					</Stack>
				</Stack>
			</ContentBox>
		</Stack>
	);
}
