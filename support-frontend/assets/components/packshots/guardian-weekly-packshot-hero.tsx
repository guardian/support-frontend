import GridPicture from 'components/gridPicture/gridPicture';

function GuardianWeeklyPackShotHero(): JSX.Element {
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

export default GuardianWeeklyPackShotHero;
