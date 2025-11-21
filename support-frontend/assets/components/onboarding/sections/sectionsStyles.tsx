import { css } from '@emotion/react';
import {
	from,
	headlineMedium20,
	headlineMedium24,
	headlineMedium28,
	neutral,
	space,
	sport,
	textSans14,
	textSans17,
	textSansBold17,
} from '@guardian/source/foundations';

const headings = css`
	${headlineMedium20}

	${from.mobileMedium} {
		${headlineMedium24}
	}

	${from.tablet} {
		${headlineMedium28}
	}
`;

const descriptions = css`
	${textSans17}
`;

const boldDescriptions = css`
	${textSansBold17}
`;

const buttonOverrides = css`
	width: 100%;
`;

const newsletterContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	padding: ${space[3]}px;
	margin-top: ${space[2]}px;

	border: 1px solid ${neutral[86]};
	border-radius: ${space[3]}px;
`;

const paymentDetailsBox = css`
	border-radius: ${space[3]}px;
	background-color: ${sport[800]};

	padding: ${space[4]}px;
	margin-top: ${space[5]}px;
`;

const paymentDetailsContainer = css`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const newslettersAppUsageInformation = css`
	${textSans14}
	margin-bottom: ${space[10]}px;
`;

const separator = css`
	width: 100%;
	border-bottom: 1px solid ${neutral[73]};
	margin: ${space[3]}px 0;
`;

const benefitsItem = css`
	display: flex;
	align-items: flex-start;
	margin-bottom: ${space[2]}px;
`;

const benefitsItemText = css`
	${descriptions}
	padding-top: ${space[0]}px;
`;

const benefitsItemIcon = css`
	min-width: ${space[8]}px;
	margin-right: ${space[2]}px;
`;

const heroContainer = css`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;

	img {
		height: 100%;
	}
`;

export {
	headings,
	descriptions,
	boldDescriptions,
	buttonOverrides,
	newsletterContainer,
	paymentDetailsBox,
	paymentDetailsContainer,
	newslettersAppUsageInformation,
	separator,
	benefitsItem,
	benefitsItemText,
	benefitsItemIcon,
	heroContainer,
};
