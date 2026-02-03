import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { Button, Stack, SvgTickRound } from '@guardian/source/react-components';
import type { HandleStepNavigationFunction } from 'pages/[countryGroupId]/components/onboardingComponent';
import { OnboardingSteps } from 'pages/[countryGroupId]/components/onboardingSteps';
import { useWindowWidth } from 'pages/aus-moment-map/hooks/useWindowWidth';
import { OnboardingAppBadgesDownload } from '../appBadgesDownload/badgesDownload';
import ContentBox from '../contentBox';
import {
	benefitsItem,
	benefitsItemIcon,
	benefitsItemText,
	boldDescriptions,
	buttonOverrides,
	descriptions,
	headings,
	newslettersAppUsageInformation,
	separator,
} from './sectionsStyles';

const GUARDIAN_APP_BENEFITS = [
	{
		title: 'Home',
		description: 'Choose the sections that matter to you.',
	},
	{
		title: 'My Guardian',
		description:
			'Personalise your feed, listen to articles, or save them for later.',
	},
	{
		title: 'Podcasts',
		description: 'All your favourites in one place.',
	},
	{
		title: 'Puzzles',
		description:
			'Upgrade your downtime with daily word, number and quiz puzzles.',
	},
	{
		title: 'Settings',
		description:
			'Customise your experience with stories for offline reading, dark mode and notifications.',
	},
	{
		title: 'Ad-free reading',
		description: 'For an uninterrupted experience.',
	},
];

const FEAST_APP_BENEFITS = [
	{
		title: 'Home',
		description:
			'Choose from over 7,000 curated recipes from our Guardian cooks.',
	},
	{
		title: 'Search',
		description:
			'Use suggested filters to help narrow down your recipe search.',
	},
	{
		title: 'My Feast',
		description:
			'Save your favourite recipes and curate your own recipe collections.',
	},
	{
		title: 'Cook mode',
		description:
			'Keep your screen from locking while following step-by-step instructions.',
	},
	{
		title: 'Shopping list',
		description: 'Add recipe ingredients to your weekly shop.',
	},
];

export function OnboardingAppsDiscovery({
	hasMobileAppDownloaded,
	hasFeastMobileAppDownloaded,
	onboardingStep,
	handleStepNavigation,
}: {
	hasMobileAppDownloaded: boolean;
	hasFeastMobileAppDownloaded: boolean;
	onboardingStep: OnboardingSteps;
	handleStepNavigation: HandleStepNavigationFunction;
}) {
	const { windowWidthIsGreaterThan } = useWindowWidth();

	const isGuardianApp = onboardingStep === OnboardingSteps.GuardianApp;
	const hasAppDownloaded = isGuardianApp
		? hasMobileAppDownloaded
		: hasFeastMobileAppDownloaded;

	const appBenefits = isGuardianApp
		? GUARDIAN_APP_BENEFITS
		: FEAST_APP_BENEFITS;

	const isTabledOrLarger = windowWidthIsGreaterThan('tablet');

	return (
		<Stack
			space={5}
			cssOverrides={css`
				margin-top: ${space[5]}px;
			`}
		>
			<ContentBox>
				<Stack space={2}>
					<h1 css={headings}>
						{isGuardianApp
							? hasAppDownloaded
								? 'Discover the Guardian app'
								: 'Download the Guardian app'
							: 'Discover the Feast app'}
					</h1>
					<p css={descriptions}>
						{isGuardianApp
							? 'Get the stuff you want, when you want it — news, sport, podcasts, puzzles and more.'
							: 'Level up your cooking with more than 6,000 recipes and smart, exclusive cooking features.'}
					</p>

					{!hasAppDownloaded && (
						<OnboardingAppBadgesDownload onboardingStep={onboardingStep} />
					)}

					<div css={separator}></div>
					<ul>
						{appBenefits.map((benefit) => (
							<li key={benefit.title} css={benefitsItem}>
								<div css={benefitsItemIcon}>
									<SvgTickRound
										isAnnouncedByScreenReader
										size={isTabledOrLarger ? 'medium' : 'small'}
										theme={{ fill: palette.brand[500] }}
									/>
								</div>
								<span css={benefitsItemText}>
									<b css={boldDescriptions}>{benefit.title}</b> —{' '}
									{benefit.description}
								</span>{' '}
							</li>
						))}
					</ul>

					<Stack
						space={0}
						cssOverrides={css`
							margin-top: ${space[5]}px;
						`}
					>
						<Button
							priority="primary"
							cssOverrides={buttonOverrides}
							onClick={() =>
								handleStepNavigation(
									isGuardianApp
										? OnboardingSteps.FeastApp
										: OnboardingSteps.Completed,
								)
							}
						>
							Continue
						</Button>
						<Button
							priority="subdued"
							cssOverrides={buttonOverrides}
							onClick={() =>
								handleStepNavigation(
									isGuardianApp
										? OnboardingSteps.Summary
										: OnboardingSteps.GuardianApp,
								)
							}
						>
							Back
						</Button>
					</Stack>
				</Stack>
			</ContentBox>
			<p css={newslettersAppUsageInformation}>
				Remember to sign in to your Guardian account to get the best experience,
				online or in the app.
			</p>
		</Stack>
	);
}
