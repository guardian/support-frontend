import GridImage from 'components/gridImage/gridImage';
import { paperPackShotContainer } from './paperPackShotStyle';

function PaperPackShot() {
	return (
		<div css={paperPackShotContainer}>
			<GridImage
				gridId="newspaperLandingHeroDesktop"
				srcSizes={[2000, 1000, 500]}
				sizes="(max-width: 739px) 140px, 422px"
				imgType="png"
			/>
		</div>
	);
}

export default PaperPackShot;
