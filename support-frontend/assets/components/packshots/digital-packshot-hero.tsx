import GridPicture from 'components/gridPicture/gridPicture';

function DigitalPackshotShotHero(): JSX.Element {
	return (
		<div className="subscriptions__digital-feature-packshot">
			<GridPicture
				sources={[
					{
						gridId: 'editionsPackshotMobile',
						srcSizes: [1000],
						imgType: 'jpg',
						sizes: '100vw',
						media: '(max-width: 739px)',
					},
				]}
				fallback="editionsPackshot"
				fallbackSize={1000}
				altText=""
				fallbackImgType="jpg"
			/>
		</div>
	);
}

export default DigitalPackshotShotHero;
