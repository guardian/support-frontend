import GridPicture from 'components/gridPicture/gridPicture';
import { weeklyPackShotContainer } from './weeklyPackshotStyle';

function WeeklyPackShot(): JSX.Element {
	return (
		<div css={weeklyPackShotContainer}>
			<GridPicture
				sources={[
					{
						gridId: 'subscriptionGuardianWeeklyHeroMobile',
						srcSizes: [1000, 500],
						sizes: '100vw',
						imgType: 'png',
						media: '(max-width: 739px)',
					},
					{
						gridId: 'subscriptionGuardianWeeklyHeroTablet',
						srcSizes: [1000, 500],
						sizes: '100vw',
						imgType: 'png',
						media: '(max-width: 979px)',
					},
				]}
				fallback="subscriptionGuardianWeeklyHeroPackShot"
				fallbackSize={1000}
				altText=""
				fallbackImgType="png"
			/>
		</div>
	);
}

export default WeeklyPackShot;
