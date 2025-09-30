import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import GridImage from 'components/gridImage/gridImage';

const mobileImg = css`
	display: block;
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
	}
`;

const desktopImg = css`
	display: none;
	height: auto;
	margin-left: auto;
	margin-top: -${space[2]}px; // padding-top over-run
	margin-bottom: -${space[5]}px; // padding-bottom over-run
	overflow: hidden;

	& img {
		width: 100%;
		display: block;
	}

	${from.tablet} {
		display: block;
		width: 270px;
	}

	${between.desktop.and.leftCol} {
		display: none;
	}
`;

function NewspaperArchiveImage(): JSX.Element {
	return (
		<>
			<div css={mobileImg}>
				<GridImage
					classModifiers={['']}
					gridId={'newspaperArchivesPackshotMobile'}
					srcSizes={[500, 140]}
					sizes="(min-width: 1140px) 100%,
                  500px"
					imgType="png"
				/>
			</div>
			<div css={desktopImg}>
				<GridImage
					classModifiers={['']}
					gridId={'newspaperArchivesPackshotDesktop'}
					srcSizes={[500, 140]}
					sizes="(min-width: 1140px) 100%,
          500px"
					imgType="png"
				/>
			</div>
		</>
	);
}

export default NewspaperArchiveImage;
