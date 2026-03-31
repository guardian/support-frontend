import type React from 'preact/compat';
import type { GridPictureProp } from 'components/gridPicture/gridPicture';
import GridPicture from 'components/gridPicture/gridPicture';

export default function WeeklyPackShots(): React.ReactElement<GridPictureProp> {
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
					gridId: `subscriptionGuardianWeeklyDigitalHero_16x9`,
					srcSizes: [2000],
					sizes: '340px',
					imgType: 'png',
					media: '(max-width: 979px)',
				},
				{
					gridId: `subscriptionGuardianWeeklyDigitalHero_16x9`,
					srcSizes: [2000],
					sizes: '435px',
					imgType: 'png',
					media: '(min-width: 980px)',
				},
			]}
			fallback={`subscriptionGuardianWeeklyDigitalHero_16x9`}
			fallbackSize={2000}
			altText="A collection of Guardian Weekly magazines"
		/>
	);
}
