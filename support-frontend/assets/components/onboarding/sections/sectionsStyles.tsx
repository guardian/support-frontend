import { css } from '@emotion/react';
import {
	from,
	neutral,
	space,
	sport,
	textSans14,
	textSans17,
	textSansBold17,
	textSansBold20,
	textSansBold24,
	textSansBold28,
} from '@guardian/source/foundations';

const headings = css`
	${textSansBold20}

	${from.mobileMedium} {
		${textSansBold24}
	}

	${from.tablet} {
		${textSansBold28}
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
`;

const benefitsItemText = css`
	${descriptions}
	line-height: ${space[8]}px;
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
