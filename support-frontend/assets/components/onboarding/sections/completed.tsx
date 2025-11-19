import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { Button, Stack, SvgTickRound } from '@guardian/source/react-components';
import GridImage from 'components/gridImage/gridImage';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { getHelpCentreUrl, getManageSubsUrl } from 'helpers/urls/externalLinks';
import type {
	HandleStepNavigationFunction,
	OnboardingProductKey,
} from 'pages/[countryGroupId]/components/onboardingComponent';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import ContentBox from '../contentBox';
import {
	benefitsItem,
	benefitsItemIcon,
	benefitsItemText,
	buttonOverrides,
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

const completedStack = css`
	margin-top: ${space[5]}px;
	position: relative;
	z-index: 1;
`;

export function OnboardingCompleted({
	productKey,
	landingPageSettings,
	handleStepNavigation,
}: {
	productKey?: OnboardingProductKey;
	landingPageSettings: LandingPageVariant;
	handleStepNavigation: HandleStepNavigationFunction;
}) {
	const productSettings =
		productKey && landingPageSettings.products[productKey];

	return (
		<Stack space={5} cssOverrides={completedStack}>
			<ContentBox>
				<Stack space={5}>
					<div css={[heroContainer, heroAspectRatio]}>
						<GridImage
							gridId={'onboardingCompletedHero'}
							srcSizes={[2000, 1000, 500]}
							sizes="(max-width: 739px) 140px, 422px"
							imgType="png"
							altText={'Onboarding completed hero'}
						/>
					</div>
					<div css={separator} />
					<h1 css={headings}>Thank you</h1>
					<p css={descriptions}>
						In a world increasingly shaped by disinformation and division, the
						Guardian’s trusted journalism stands as a powerful counterforce.
					</p>
					<p css={descriptions}>
						Your support makes that possible, and now that your All-access
						digital subscription is active, you have access to:
					</p>
					<ul>
						{productSettings?.benefits.map((benefit) => (
							<li
								css={benefitsItem}
								key={`onboarding-summary-benefit-${benefit.copy}`}
							>
								<div css={benefitsItemIcon}>
									<SvgTickRound
										isAnnouncedByScreenReader
										size="medium"
										theme={{ fill: palette.brand[500] }}
									/>
								</div>
								<span css={benefitsItemText}>{benefit.copy}</span>
							</li>
						))}
					</ul>
					<Button
						priority="primary"
						cssOverrides={[buttonOverrides]}
						onClick={() => handleStepNavigation(OnboardingSteps.Completed)}
					>
						Continue to the Guardian
					</Button>
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
