import GridImage from 'components/gridImage/gridImage';

function PrintFeaturePackshot() {
	return (
		<div className="subscriptions-print-feature--packshot">
			<GridImage
				classModifiers={['subscriptions-print-feature-image']}
				gridId="printFeaturePackshot"
				srcSizes={[1000, 500, 140]}
				sizes="(min-width: 480px) 100%"
				imgType="png"
			/>
		</div>
	);
}

export default PrintFeaturePackshot;
