import GridPicture from 'components/gridPicture/gridPicture';
import shouldShowObserverCard from 'pages/paper-subscription-landing/helpers/shouldShowObserver';

function GuardianWeeklyPackShotHero(): JSX.Element {
	if (shouldShowObserverCard()) {
		return (
			<div className="subscriptions-feature-packshot">
				<GridPicture
					sources={[
						{
							gridId: 'subscriptionGuardianWeeklyWithObserverHeroPackShot',
							srcSizes: [500],
							imgType: 'png',
							sizes: '100vw',
							media: '(max-width: 739px) 500px',
						},
					]}
					fallback="subscriptionGuardianWeeklyWithObserverHeroPackShot"
					fallbackSize={1000}
					altText=""
					fallbackImgType="png"
				/>
			</div>
		);
	}

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
