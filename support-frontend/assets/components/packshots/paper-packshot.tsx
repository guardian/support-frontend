import GridImage from 'components/gridImage/gridImage';
import shouldShowObserverCard from 'pages/paper-subscription-landing/helpers/shouldShowObserver';

function PaperPackshot() {
	const gridId = shouldShowObserverCard()
		? 'subscriptionPrintObserver'
		: 'subscriptionPrint';

	return (
		<div className="subscriptions__paper-packshot">
			<GridImage
				gridId={gridId}
				srcSizes={[500, 140]}
				sizes="(max-width: 739px) 140px,
             (max-width: 979px) 500px,
             (max-width: 1140px) 500px,
             500px"
				imgType="png"
			/>
		</div>
	);
}

export default PaperPackshot;
