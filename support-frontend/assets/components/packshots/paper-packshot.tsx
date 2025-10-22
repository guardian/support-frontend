import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';
import GridImage from 'components/gridImage/gridImage';

const subscriptions__paper_packshot = css`
	width: 382px;

	${until.tablet} {
		width: 100%;
	}

	img:nth-child(1) {
		z-index: 2;
		left: 80px;
		position: absolute;
		bottom: 0;

		${until.leftCol} {
			left: 50px;
			width: 90%;
		}

		${until.desktop} {
			left: 20px;
		}

		${until.tablet} {
			width: 100%;
			position: inherit;
		}
	}
`;

function PaperPackshot() {
	return (
		<div css={subscriptions__paper_packshot}>
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
