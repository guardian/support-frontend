import GridPicture from 'components/gridPicture/gridPicture';

function DigitalPackshot() {
	return (
		<div className="subscriptions-int-daily-packshot">
			<GridPicture
				sources={[
					{
						gridId: 'editionsPackshot',
						srcSizes: [500, 140],
						imgType: 'png',
						sizes: '100vw',
						media: '(max-width: 739px)',
					},
					{
						gridId: 'editionsPackshot',
						srcSizes: [1000, 500],
						imgType: 'png',
						sizes: '(min-width: 1000px) 2000px, 1000px',
						media: '(min-width: 740px)',
					},
				]}
				fallback="editionsPackshot"
				fallbackSize={1000}
				altText=""
				fallbackImgType="png"
			/>
		</div>
	);
}

export default DigitalPackshot;
