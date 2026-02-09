import { css } from '@emotion/react';
import { from, neutral, palette, space } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import BenefitsList from 'components/product/BenefitsList';
import type { PlanData } from 'pages/paper-subscription-landing/planData';
import {
	borderWhite,
	weeklyBenefitsPaperHeroBlue,
} from 'stylesheets/emotion/colours';

const benefitsContainer = css`
	background-color: ${weeklyBenefitsPaperHeroBlue};
	color: ${neutral[100]};
	border-radius: ${space[2]}px;
	width: 100%;
	padding: ${space[3]}px ${space[4]}px ${space[8]}px;
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
	display: flex;
	flex-direction: column;
`;

type WeeklyBenefitsPropTypes = {
	countryId: IsoCountry;
	planData?: PlanData;
};

export function WeeklyBenefits({
	planData,
}: WeeklyBenefitsPropTypes): JSX.Element {
	return (
		<section css={benefitsContainer} id="subscribeWeeklyBenefits">
			<div>
				<h2>What do you get with a Guardian Weekly subscription?</h2>
				<div css={benfitsBorder}>
					<BenefitsList
						title={planData?.benefits.label}
						listItems={planData?.benefits.items}
						theme={{ fill: palette.brandAlt[400] }}
					/>
					<BenefitsList
						title={planData?.digitalRewards?.label}
						listItems={planData?.digitalRewards?.items}
						theme={{ fill: palette.brandAlt[400] }}
					/>
				</div>
			</div>
			<div>IMAGE</div>
		</section>
	);
}
