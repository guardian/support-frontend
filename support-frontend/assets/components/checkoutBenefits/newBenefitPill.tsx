import { css } from '@emotion/react';
import {
	neutral,
	news,
	space,
	textSansBold14,
} from '@guardian/source/foundations';

const newBenefitPill = css`
	background-color: ${news[400]};
	color: ${neutral[100]};
	${textSansBold14};
	border-radius: 4px;
	padding: 0 ${space[1]}px;
	vertical-align: middle;
`;

export function NewBenefitPill() {
	return <span css={newBenefitPill}>New</span>;
}
