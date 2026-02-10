import { css } from '@emotion/react';
import { neutral, space } from '@guardian/source/foundations';
import { weeklyBenefitsPaperHeroBlue } from 'stylesheets/emotion/colours';

const benefitsContainer = css`
	background-color: ${weeklyBenefitsPaperHeroBlue};
	color: ${neutral[100]};
	border-radius: ${space[2]}px;
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
`;

type WeeklyBenefitsPropTypes = {
	sampleCopy?: string;
};

export function WeeklyBenefits({
	sampleCopy,
}: WeeklyBenefitsPropTypes): JSX.Element {
	return <div css={benefitsContainer}>{sampleCopy}</div>;
}
