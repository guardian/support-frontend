import type React from 'preact/compat';
import type { GridPictureProp } from 'components/gridPicture/gridPicture';
import GridPicture from 'components/gridPicture/gridPicture';

export function WeeklySubscriptionPackShot(): React.ReactElement<GridPictureProp> {
	return (
		<GridPicture
			sources={[
				{
					gridId: `subscriptionGuardianWeeklyDigitalHero_16x9`,
					srcSizes: [1000],
					sizes: '331px',
					imgType: 'png',
					media: '(max-width: 739px)',
				},
				{
					gridId: `subscriptionGuardianWeeklyDigitalHero_1x1`,
					srcSizes: [1000],
					sizes: '340px',
					imgType: 'png',
					media: '(max-width: 979px)',
				},
				{
					gridId: `subscriptionGuardianWeeklyDigitalHero_4x3`,
					srcSizes: [1000],
					sizes: '435px',
					imgType: 'png',
					media: '(min-width: 980px)',
				},
			]}
			fallback={`subscriptionGuardianWeeklyDigitalHero_4x3`}
			fallbackSize={1000}
			altText="A collection of Guardian Weekly magazines"
		/>
	);
}

export function WeeklyLandingPagePackShot(): React.ReactElement<GridPictureProp> {
	return (
		<GridPicture
			sources={[
				{
					gridId: `weeklyDigitalLandingHeroMobile_16x9`,
					srcSizes: [1000],
					sizes: '331px',
					imgType: 'png',
					media: '(max-width: 739px)',
				},
				{
					gridId: `weeklyDigitalLandingHeroTablet_1x1`,
					srcSizes: [2000],
					sizes: '340px',
					imgType: 'png',
					media: '(max-width: 979px)',
				},
				{
					gridId: `weeklyDigitalLandingHeroDesktop_4x3`,
					srcSizes: [2000],
					sizes: '435px',
					imgType: 'png',
					media: '(min-width: 980px)',
				},
			]}
			fallback={`weeklyDigitalLandingHeroDesktop_4x3`}
			fallbackSize={2000}
			altText="A collection of Guardian Weekly magazines"
		/>
	);
}
