import GridPicture from 'components/gridPicture/gridPicture';
import { digitalPackShotContainer } from './digitalPackShotStyle';

function DigitalPackShot(): JSX.Element {
	return (
		<div css={digitalPackShotContainer}>
			<GridPicture
				sources={[
					{
						gridId: 'digitalEditionsPackshotMobile',
						srcSizes: [1000],
						imgType: 'jpg',
						sizes: '100vw',
						media: '(max-width: 739px)',
					},
				]}
				fallback="digitalEditionsPackshot"
				fallbackSize={1000}
				altText=""
				fallbackImgType="jpg"
			/>
		</div>
	);
}

export default DigitalPackShot;
