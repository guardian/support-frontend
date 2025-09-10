import GridImage from 'components/gridImage/gridImage';
import { inPaperProductTest } from 'pages/paper-subscription-landing/helpers/inPaperProductTest';

function PaperPackshot() {
	const isPaperProductTest = inPaperProductTest();
	return (
		<div className="subscriptions__paper-packshot">
			{isPaperProductTest ? (
				<GridImage
					gridId="newspaperLandingHeroDesktop"
					srcSizes={[2000, 1000, 500]}
					sizes="(max-width: 739px) 140px, 422px"
					imgType="png"
				/>
			) : (
				<GridImage
					gridId="subscriptionPrintObserver"
					srcSizes={[500, 140]}
					sizes="(max-width: 739px) 140px, 500px"
					imgType="png"
				/>
			)}
		</div>
	);
}

export default PaperPackshot;
