import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { Button, Stack, SvgTickRound } from '@guardian/source/react-components';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
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
		description: 'Stay connected with the latest live events.',
	},
	{
		title: 'My Guardian',
		description:
			'Follow topics, save articles for later and view your reading history.',
	},
	{
		title: 'Podcasts',
		description: 'Play all our latest episodes from one place.',
	},
	{
		title: 'Puzzles',
		description: 'Play our daily word, logic and quiz games.',
	},
	{
		title: 'Settings',
		description:
			'Set up your live events feed, notifications, offline reading and more.',
	},
	{
		title: 'Ad-free reading',
		description: 'Enjoy an uninterrupted experience.',
	},
];

const FEAST_APP_BENEFITS = [
	{
		title: 'Home',
		description:
			'Get inspired with over 7,000 recipes from our world-class cooks - and app exclusive recipes, just for you.',
	},
	{
		title: 'Search',
		description:
			'Use suggested filters to help narrow down your recipe search.',
	},
	{
		title: 'My Feast',
		description: 'Save your favourite recipes to your own curated collection.',
	},
	{
		title: 'Cook mode',
		description:
			'Keep your screen from locking while following step-by-step instructions.',
	},
	{
		title: 'Shopping list',
		description: 'Add recipe ingredients and tick them off as you shop.',
	},
] as const;

const FEAST_APP_UNITS_BENEFIT = {
	title: 'Recipes',
	description: 'Convert any recipe from metric to standard US units.',
};

const FEAST_APP_BENEFITS_US = [
	FEAST_APP_BENEFITS[0],
	FEAST_APP_UNITS_BENEFIT,
	...FEAST_APP_BENEFITS.slice(1),
];

export function OnboardingAppsDiscovery({
	hasMobileAppDownloaded,
	hasFeastMobileAppDownloaded,
	onboardingStep,
	supporterRegion,
	handleStepNavigation,
}: {
	hasMobileAppDownloaded: boolean;
	hasFeastMobileAppDownloaded: boolean;
	onboardingStep: OnboardingSteps;
	handleStepNavigation: HandleStepNavigationFunction;
	supporterRegion: SupportRegionId;
}) {
	const { windowWidthIsGreaterThan } = useWindowWidth();

	const isGuardianApp = onboardingStep === OnboardingSteps.GuardianApp;
	const hasAppDownloaded = isGuardianApp
		? hasMobileAppDownloaded
		: hasFeastMobileAppDownloaded;

	const FEAST_APP_BENEFITS_REGION =
		supporterRegion === SupportRegionId.US
			? FEAST_APP_BENEFITS_US
			: FEAST_APP_BENEFITS;

	const appBenefits = isGuardianApp
		? GUARDIAN_APP_BENEFITS
		: FEAST_APP_BENEFITS_REGION;

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
							? 'News, sport, podcasts, puzzles and more.'
							: 'Rated 4 out of 5 stars by our Feast community.'}
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
