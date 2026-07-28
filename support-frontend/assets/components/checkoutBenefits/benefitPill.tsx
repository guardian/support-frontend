import { css } from '@emotion/react';
import {
	neutral,
	palette,
	space,
	textSansBold14,
} from '@guardian/source/foundations';

const benefitPillCss = (isTitlePill: boolean) => css`
	background-color: ${isTitlePill ? palette.brand[500] : palette.news[400]};
	color: ${neutral[100]};
	${textSansBold14};
	border-radius: 4px;
	padding: 0 ${space[1]}px;
	vertical-align: middle;
`;

interface BenefitPillProps {
	copy: string;
	isTitlePill?: boolean;
}

export function BenefitPill({ copy, isTitlePill = false }: BenefitPillProps) {
	return <span css={benefitPillCss(isTitlePill)}>{copy}</span>;
}
