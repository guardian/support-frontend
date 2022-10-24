import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source-foundations';
import GridImage from 'components/gridImage/gridImage';

const mobileImg = css`
	display: block;
	max-width: 230px;
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
	max-width: 220px;
	height: auto;
	margin-left: auto;

	& img {
		width: 100%;
		display: block;
	}

	${from.tablet} {
		display: block;
	}

	${between.desktop.and.leftCol} {
		display: none;
	}
`;

// will need to tweak the offset margins here if the image or copy is updated
// to ensure this image lines up correctly with the app download badges
const container = css`
	${from.tablet} {
		margin-top: -${space[9]}px;
	}

	${between.leftCol.and.wide} {
		margin-top: 0;
		margin-left: ${space[5]}px;
	}

	${from.wide} {
		margin-top: -32px;
	}
`;

function AppDownloadImage(): JSX.Element {
	return (
		<div css={container}>
			<div css={mobileImg}>
				<GridImage
					classModifiers={['']}
					/////////////////////////
					// PLACEHOLDER GRID ID //
					/////////////////////////
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
					/////////////////////////
					// PLACEHOLDER GRID ID //
					/////////////////////////
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
