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
	padding: ${space[1]}px;
`;

export function NewBenefitPill() {
	return <div css={newBenefitPill}>New</div>;
}
