import { css } from '@emotion/react';
import {
	neutral,
	palette,
	space,
	textSansBold14,
} from '@guardian/source/foundations';

const benefitPillCss = (pillColor?: string) => css`
	background-color: ${pillColor ?? palette.news[400]};
	color: ${neutral[100]};
	${textSansBold14};
	border-radius: 4px;
	padding: 0 ${space[1]}px;
	vertical-align: middle;
`;

interface BenefitPillProps {
	copy: string;
	pillColor?: string;
}

export function BenefitPill({ copy, pillColor }: BenefitPillProps) {
	return <span css={benefitPillCss(pillColor)}>{copy}</span>;
}
