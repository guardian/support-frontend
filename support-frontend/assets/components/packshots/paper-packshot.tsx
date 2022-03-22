import GridImage from 'components/gridImage/gridImage';

function PaperPackshot() {
	return (
		<div className="subscriptions__paper-packshot">
			<GridImage
				gridId="subscriptionPrint"
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
