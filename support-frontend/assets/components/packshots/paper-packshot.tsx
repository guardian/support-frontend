import GridImage from 'components/gridImage/gridImage';

function PaperPackshot() {
	return (
		<div className="subscriptions__paper-packshot">
			<GridImage
				gridId="newspaperLandingHeroDesktop"
				srcSizes={[2000, 1000, 500]}
				sizes="(max-width: 739px) 140px, 422px"
				imgType="png"
			/>
		</div>
	);
}

export default PaperPackshot;
