import { css } from '@emotion/react';
import { from, neutral, space } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import {
	borderWhite,
	weeklyBenefitsPaperHeroBlue,
} from 'stylesheets/emotion/colours';

const benefitsContainer = css`
	background-color: ${weeklyBenefitsPaperHeroBlue};
	color: ${neutral[100]};
	border-radius: ${space[2]}px;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	${from.desktop} {
		flex-direction: row;
		justify-content: space-between;
	}
`;
const benfitsBorder = css`
	border-top: 1px solid ${borderWhite};
`;

type WeeklyBenefitsPropTypes = {
	countryId: IsoCountry;
};

export function WeeklyBenefits({
	countryId,
}: WeeklyBenefitsPropTypes): JSX.Element {
	return (
		<section css={benefitsContainer} id="subscribeWeeklyBenefits">
			<div>
				<h2>What do you get with a Guardian Weekly subscription?</h2>
				<div css={benfitsBorder}>BENEFITS - {countryId}</div>
			</div>
			<div>IMAGE</div>
		</section>
	);
}
