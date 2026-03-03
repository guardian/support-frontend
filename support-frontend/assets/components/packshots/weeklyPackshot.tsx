import GridImage from 'components/gridImage/gridImage';
import GridPicture from 'components/gridPicture/gridPicture';
import {
	weeklyDigitalContainer,
	weeklyPackShotContainer,
} from './weeklyPackshotStyle';

function WeeklyPackShot({
	enableDisplayWeeklyDigital,
}: {
	enableDisplayWeeklyDigital?: boolean;
}): JSX.Element {
	return (
		<>
			{enableDisplayWeeklyDigital ? (
				<div css={weeklyDigitalContainer}>
					<GridImage
						gridId={'subscriptionGuardianWeeklyDigitalHero_4x3'}
						srcSizes={[453]}
						sizes="453px"
						imgType="png"
						altText="Illustration of The Guardian Weekly Subscription"
					/>
				</div>
			) : (
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
						fallback={'subscriptionGuardianWeeklyHeroPackShot'}
						fallbackSize={550}
						altText=""
						fallbackImgType="png"
					/>
				</div>
			)}
		</>
	);
}

export default WeeklyPackShot;
