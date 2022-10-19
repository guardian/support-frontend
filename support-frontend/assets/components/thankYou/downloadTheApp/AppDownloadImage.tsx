import { css } from '@emotion/react';
import { from, space } from '@guardian/source-foundations';
import GridImage from 'components/gridImage/gridImage';

const mobileImg = css`
	display: block;
	width: 230px;
	height: auto;
	margin: auto;

	${from.mobileMedium} {
		margin: initial;
	}

	${from.tablet} {
		display: none;
	}

	& img {
		width: 100%;
		display: block;
		margin: auto;

		${from.mobileMedium} {
			margin-left: 64px;
		}
	}
`;

const desktopImg = css`
	display: none;
	width: 220px;
	height: auto;
	margin-left: auto;

	& img {
		width: 100%;
		display: block;
	}

	${from.tablet} {
		display: block;
	}
`;

const container = css`
	margin-top: -${space[2]}px;

	${from.tablet} {
		margin-top: -${space[9]}px;
	}
`;

function AppDownloadImage(): JSX.Element {
	return (
		<div css={container}>
			<div css={mobileImg}>
				<GridImage
					classModifiers={['']}
					gridId={'benefitsPackshotParaMobAndDesktopUK'}
					srcSizes={[500, 140]}
					sizes="(min-width: 1140px) 100%,
                  500px"
					imgType="png"
				/>
			</div>
			<div css={desktopImg}>
				<GridImage
					classModifiers={['']}
					gridId={'benefitsPackshotBulletsDesktopUK'}
					srcSizes={[500, 140]}
					sizes="(min-width: 1140px) 100%,
          500px"
					imgType="png"
				/>
			</div>
		</div>
	);
}

export default AppDownloadImage;
