import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans17,
} from '@guardian/source/foundations';
import { SvgTickRound } from '@guardian/source/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { PrintFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { productCatalogDescription } from 'helpers/productCatalog';
import { getCountryGroup } from 'helpers/productPrice/productPrices';
import { getPrintPlanData } from 'pages/paper-subscription-landing/planData';
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
	flex-direction: row;
`;

const benefitsItemText = css`
	${textSans17};
	padding-top: ${space[0]}px;
`;
const benefitsItemIcon = css`
	min-width: ${space[8]}px;
	margin-right: ${space[0]}px;
`;
const listItem = css`
	display: flex;
	align-items: flex-start;
	margin-bottom: ${space[2]}px;
`;

type WeeklyBenefitsPropTypes = {
	countryId: IsoCountry;
};

export function WeeklyBenefits({
	countryId,
}: WeeklyBenefitsPropTypes): JSX.Element {
	const countryRegion = getCountryGroup(countryId).supportRegionId;
	const productKey =
		countryRegion == SupportRegionId.INT
			? 'GuardianWeeklyRestOfWorld'
			: 'GuardianWeeklyDomestic';
	const fulfilmentOption: PrintFulfilmentOptions =
		countryRegion == SupportRegionId.INT ? 'RestOfWorld' : 'Domestic';

	const printData = getPrintPlanData('NoProductOptions', fulfilmentOption);
	console.log('*** weekly printData', printData);
	const benefits = productCatalogDescription[productKey].benefits;
	return (
		<section css={benefitsContainer} id="subscribeWeeklyBenefits">
			<div>
				<h2>What do you get with a Guardian Weekly subscription?</h2>
				<div css={benfitsBorder}>
					<ul>
						{benefits.map((benefit) => (
							<li key={benefit.copy} css={listItem}>
								<div css={benefitsItemIcon}>
									<SvgTickRound
										isAnnouncedByScreenReader
										size={'small'}
										theme={{ fill: palette.brandAlt[400] }}
									/>
								</div>
								<span css={benefitsItemText}>
									{benefit.copyBoldStart}
									{benefit.copy}
								</span>{' '}
							</li>
						))}
					</ul>
				</div>
			</div>
			<div>IMAGE</div>
		</section>
	);
}
