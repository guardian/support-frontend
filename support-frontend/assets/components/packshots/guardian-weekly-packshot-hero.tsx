// import GridImage from 'components/gridImage/gridImage';
import GridPicture from 'components/gridPicture/gridPicture';

function GuardianWeeklyPackShotHero(): JSX.Element {
	return (
		<div className="subscriptions-feature-packshot">
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

export default GuardianWeeklyPackShotHero;
