import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	neutral,
	titlepiece50,
} from '@guardian/source/foundations';

export const featureContainer = css`
	padding: 30px 0 30px 20px;
	width: 100%;
	background-color: ${brandAlt[400]};

	${from.tablet} {
		padding: 50px 0 55px;
	}
`;
export const featureHeaderContainer = css`
	max-width: 1290px;
	margin: 0 auto;
`;
export const featureHeader = css`
	max-width: 400px;
	${titlepiece50};
	font-size: 28px;
	line-height: 30px;
	padding-left: 10px;
	font-weight: bold;
	padding-right: 10px;
	color: ${neutral[7]};

	${from.mobileLandscape} {
		max-width: 500px;
		font-size: 40px;
		line-height: 42px;
		padding-right: 20px;
	}

	${from.tablet} {
		max-width: 700px;
		line-height: 45px;
	}

	${from.desktop} {
		max-width: 800px;
		padding-left: 70px;
		font-size: 50px;
		line-height: 55px;
	}

	${from.wide} {
		padding-left: 50px;
	}
`;
