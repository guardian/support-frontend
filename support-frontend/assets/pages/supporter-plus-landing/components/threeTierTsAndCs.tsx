import { css } from '@emotion/react';
import { from, palette, textSans12 } from '@guardian/source/foundations';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import {
	getDateWithOrdinal,
	getLongMonth,
	getNumericYear,
} from 'helpers/utilities/dateFormatting';

interface TsAndCsProps {
	title: string;
	planCost: TierPlanCosts;
	starts?: Date;
	expires?: Date;
}

interface ThreeTierTsAndCsProps {
	tsAndCsContent: TsAndCsProps[];
	currency: string;
}

interface TierPlanCosts {
	price: number;
	promoCode?: string;
	discount?: {
		percentage: number;
		price: number;
		duration: { value: number; period: BillingPeriod };
	};
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
	planCost: TierPlanCosts,
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

export function ThreeTierTsAndCs({
	tsAndCsContent,
	currency,
}: ThreeTierTsAndCsProps): JSX.Element {
	/*
  Each Ts&Cs is bound to a tierCard, a matching promoCount exists in threeTierCards
  therefore the '*' count can match between the promotion offer description & its
  associated Ts&Cs.
  */
	let promoCount = 0;
	return (
		<>
			{tsAndCsContent.map((tcContent) => {
				if (tcContent.planCost.discount) {
					promoCount++;
					return (
						<div css={container}>
							<p>
								{'*'.repeat(promoCount)} {tcContent.title} offer is{' '}
								{discountSummaryCopy(currency, tcContent.planCost)} afterwards
								unless you cancel. Offer only available to new subscribers who
								do not have an existing subscription with the Guardian.
								{tcContent.starts &&
									tcContent.expires &&
									` Offer starts on the ${getDateWithOrdinal(
										tcContent.starts,
									)} ${getLongMonth(
										tcContent.starts,
									)} and ends on the ${getDateWithOrdinal(
										tcContent.expires,
									)} ${getLongMonth(tcContent.expires)} ${getNumericYear(
										tcContent.expires,
									)}.`}
							</p>
						</div>
					);
				}

				return;
			})}
		</>
	);
}
