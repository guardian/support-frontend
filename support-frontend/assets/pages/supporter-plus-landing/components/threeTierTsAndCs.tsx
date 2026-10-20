import { css } from '@emotion/react';
import { from, palette, textSans12 } from '@guardian/source/foundations';
import { useEffect } from 'react';
import { usePromoTerms } from 'contexts/PromoTermsContext';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import {
	getDateWithOrdinal,
	getLongMonth,
	getNumericYear,
} from 'helpers/utilities/dateFormatting';
import type { TierPlanCost } from 'pages/[countryGroupId]/helpers/getTierPlanCost';

export interface TsAndCsProps {
	title: string;
	planCost: TierPlanCost;
	starts?: Date;
	expires?: Date;
}

interface ThreeTierTsAndCsProps {
	tsAndCsContent: TsAndCsProps[];
	currency: string;
}

const container = css`
	text-align: left;
	color: ${palette.neutral[100]};
	${textSans12};
	line-height: 1.15;
	${from.desktop} {
		max-width: 780px;
	}
`;

const discountSummaryCopy = (
	currency: string,
	planCost: TierPlanCost,
): string | undefined => {
	// EXAMPLE: £16/month for the first 12 months, then £25/month
	if (planCost.discount) {
		const duration = planCost.discount.duration.value;
		const period = planCost.discount.duration.period;
		const periodNoun = getBillingPeriodNoun(period);
		const promoPrice = planCost.discount.price;
		const promoPriceRounded =
			promoPrice % 1 === 0 ? promoPrice : promoPrice.toFixed(2);
		return `${currency}${promoPriceRounded}/${periodNoun} for the first ${
			duration > 1 ? duration : ''
		} ${periodNoun}${duration > 1 ? 's' : ''}, then ${currency}${
			planCost.price
		}/${periodNoun}`;
	}

	return;
};

const buildPromoTerms = (
	currency: string,
	tcContent: TsAndCsProps,
	promoCount: number,
): string => {
	const { title, planCost, starts, expires } = tcContent;
	const offerDates =
		starts && expires
			? ` Offer starts on the ${getDateWithOrdinal(starts)} ${getLongMonth(
					starts,
			  )} and ends on the ${getDateWithOrdinal(expires)} ${getLongMonth(
					expires,
			  )} ${getNumericYear(expires)}.`
			: '';

	return `${'*'.repeat(promoCount)} ${title} offer is ${discountSummaryCopy(
		currency,
		planCost,
	)} afterwards unless you cancel. Offer only available to new subscribers who do not have an existing subscription with the Guardian.${offerDates}`;
};

const haveSameTerms = (a: string[], b: string[]): boolean =>
	a.length === b.length && a.every((terms, index) => terms === b[index]);

export function ThreeTierTsAndCs({
	tsAndCsContent,
	currency,
}: ThreeTierTsAndCsProps): JSX.Element {
	const { promoTerms } = usePromoTerms();
	console.log('🚀 ~ ThreeTierTsAndCs ~ promoTerms:', promoTerms);

	// 	/*
	//   Each Ts&Cs is bound to a tierCard, a matching promoCount exists in threeTierCards
	//   therefore the '*' count can match between the promotion offer description & its
	//   associated Ts&Cs.
	//   */
	// 	const promoTerms = tsAndCsContent
	// 		.filter((tcContent) => tcContent.planCost.discount)
	// 		.map((tcContent, index) => buildPromoTerms(currency, tcContent, index + 1));

	// 	useEffect(() => {
	// 		// Keep the existing array when the terms are unchanged, to avoid re-rendering the provider
	// 		setPromoTerms((current) =>
	// 			haveSameTerms(current, promoTerms) ? current : promoTerms,
	// 		);
	// 	});

	return (
		<>
			{promoTerms.map((terms) => (
				<div css={container}>
					<p>{terms}</p>
				</div>
			))}
		</>
	);
}
