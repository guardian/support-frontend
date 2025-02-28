import { css } from '@emotion/react';
import {
	neutral,
	news,
	space,
	textSansBold14,
} from '@guardian/source/foundations';

const benefitPillCss = css`
	background-color: ${news[400]};
	color: ${neutral[100]};
	${textSansBold14};
	border-radius: 4px;
	padding: 0 ${space[1]}px;
	vertical-align: middle;
`;

interface BenefitPillProps {
	copy: string;
}

export function BenefitPill({ copy }: BenefitPillProps) {
	return <span css={benefitPillCss}>{copy}</span>;
}
