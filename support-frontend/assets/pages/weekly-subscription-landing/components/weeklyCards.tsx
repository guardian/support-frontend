import { css } from '@emotion/react';
import {
	from,
	headlineBold24,
	neutral,
	space,
	textEgyptian17,
} from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import { weeklyBillingPeriods } from 'helpers/productPrice/billingPeriods';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getWeeklyDigitalRatePlans } from '../helpers/getWeeklyProducts';
import WeeklyRatePlanCard from './WeeklyRatePlanCard';

const pricesSection = css`
	color: ${neutral[100]};
`;

const pricesHeadline = css`
	${headlineBold24};
	${from.tablet} {
		font-size: 34px;
	}
`;

const pricesSubHeadline = css`
	${textEgyptian17};
	padding-bottom: ${space[4]}px;
`;

const priceCardsContainer = css`
	margin: ${space[10]}px 0 ${space[8]}px;
	color: ${neutral[7]};
	border-radius: ${space[2]}px;
	display: flex;
	flex-direction: column;
	width: 100%;
	justify-content: center;
	gap: ${space[5]}px;
	${from.desktop} {
		flex-direction: row;
	}
`;

export function WeeklyCards({
	countryId,
	productPrices,
}: {
	countryId: IsoCountry;
	productPrices: ProductPrices;
}): JSX.Element {
	const ratePlans = getWeeklyDigitalRatePlans({
		countryId,
		productPrices,
		weeklyBillingPeriods,
	});

	return (
		<section css={pricesSection} id="subscribeWeekly">
			<h2 css={pricesHeadline}>Subscribe to the Guardian Weekly today</h2>
			<p css={pricesSubHeadline}>Choose how you'd like to pay</p>
			<div css={priceCardsContainer}>
				{ratePlans.map((ratePlan) => (
					<WeeklyRatePlanCard {...ratePlan} />
				))}
			</div>
		</section>
	);
}
