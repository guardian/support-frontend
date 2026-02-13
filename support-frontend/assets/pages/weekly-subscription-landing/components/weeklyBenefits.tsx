import { css } from '@emotion/react';
import {
	between,
	from,
	headlineBold24,
	neutral,
	palette,
	space,
	textSans17,
} from '@guardian/source/foundations';
import GridImage from 'components/gridImage/gridImage';
import BenefitsList from 'components/product/BenefitsList';
import type { PlanData } from 'pages/paper-subscription-landing/planData';
import {
	borderLightGrey,
	weeklyBenefitsPaperHeroBlue,
} from 'stylesheets/emotion/colours';

const weeklyBenefitsContainer = css`
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
const benefitsContainer = css`
	padding: ${space[3]}px 0 ${space[8]}px ${space[4]}px;
	width: 100%;
	${from.desktop} {
		padding-right: ${space[5]}px;
		max-width: 508px;
	}
	${from.leftCol} {
		max-width: 536px;
	}
	${from.wide} {
		max-width: 620px;
	}
`;
const imageContainerDesktop = css`
	display: none;
	${between.desktop.and.leftCol} {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		img {
			border-radius: ${space[2]}px;
		}
	}
`;
const imageContainerLeftCol = css`
	display: none;
	${from.leftCol} {
		display: flex;
		justify-content: flex-end;
		padding: ${space[8]}px 0 ${space[8]}px;
		width: 100%;
		img {
			border-radius: ${space[2]}px;
		}
	}
	${from.wide} {
		padding: 0;
		img {
			border-radius: 0 ${space[2]}px ${space[2]}px 0;
		}
	}
`;
const headingContainer = css`
	${headlineBold24};
	margin-bottom: ${space[8]}px;
`;
const benefitsBorder = css`
	border-top: 1px solid ${borderLightGrey};
	display: flex;
	flex-direction: column;
`;
const benefitsList = css`
	ul {
		padding-top: ${space[3]}px;
	}
	${textSans17};
`;

export type WeeklyBenefitsProps = {
	planData?: PlanData;
};
export function WeeklyBenefits({ planData }: WeeklyBenefitsProps): JSX.Element {
	return (
		<section css={weeklyBenefitsContainer} id="subscribeWeeklyBenefits">
			<div css={benefitsContainer}>
				<h2 css={headingContainer}>
					What do you get with a Guardian Weekly subscription?
				</h2>
				<div css={benefitsBorder}>
					<BenefitsList
						title={planData?.benefits.label}
						listItems={[
							...(planData?.benefits.items ?? []),
							...(planData?.digitalRewards?.items ?? []),
						]}
						theme={{ fill: palette.brandAlt[400] }}
						cssOverrides={benefitsList}
					/>
				</div>
			</div>
			<div css={imageContainerDesktop}>
				<GridImage
					gridId={`weeklyBenefitHeroDesktop`}
					srcSizes={[400]}
					sizes="400px"
					imgType="png"
					altText="Illustration of The Guardian Weekly benefits"
				/>
			</div>
			<div css={imageContainerLeftCol}>
				<GridImage
					gridId={`weeklyBenefitHeroLeftCol`}
					srcSizes={[541, 621]}
					sizes="(min-width: 541px) 541px, (min-width: 621px) 621px"
					imgType="png"
					altText="Illustration of The Guardian Weekly benefits"
				/>
			</div>
		</section>
	);
}
