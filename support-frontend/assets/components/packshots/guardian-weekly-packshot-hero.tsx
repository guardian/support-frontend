import GridImage from 'components/gridImage/gridImage';

function GuardianWeeklyPackShotHero(): JSX.Element {
	return (
		<div className="subscriptions-feature-packshot">
			<GridImage
				gridId="subscriptionGuardianWeeklyPackShot"
				srcSizes={[1000, 500]}
				sizes="(max-width: 480px) 100px,
              (max-width: 740px) 100%,
              (max-width: 1067px) 150%,
              800px"
				imgType="png"
			/>
		</div>
	);
}

export default GuardianWeeklyPackShotHero;
