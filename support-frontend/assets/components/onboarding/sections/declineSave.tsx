import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import { Button, Stack, SvgTickRound } from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { useNavigate } from 'react-router';
import GridImage from 'components/gridImage/gridImage';
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

export function OnboardingDeclineSave({
	supportRegionId,
	landingPageSettings,
	invitationId,
}: {
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
	invitationId: string;
}) {
	const navigate = useNavigate();
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
						altText="Redeem your invitation hero"
					/>
				</div>

				<Stack space={5} cssOverrides={contentPadding}>
					<div css={separator} />
					<Stack space={2}>
						<h1 css={headings}>Redeem your invitation</h1>
						<p css={descriptions}>Activate your access to get:</p>
					</Stack>
					<ul>
						{benefitsChecklist.map((benefit) => (
							<li
								css={benefitsItem}
								key={`onboarding-decline-save-benefit-${
									benefit.text as string
								}`}
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
					<Button
						priority="primary"
						cssOverrides={buttonOverrides}
						onClick={() => {
							void navigate(
								`/${supportRegionId}/join?invitationId=${invitationId}`,
							);
						}}
					>
						Redeem invitation
					</Button>
				</Stack>
			</ContentBox>
		</Stack>
	);
}
