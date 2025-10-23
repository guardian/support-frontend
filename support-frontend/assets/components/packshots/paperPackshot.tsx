import GridImage from 'components/gridImage/gridImage';
import { paperPackshotContainer } from './paperPackshotStyle';

function PaperPackshot() {
	return (
		<div css={paperPackshotContainer}>
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
