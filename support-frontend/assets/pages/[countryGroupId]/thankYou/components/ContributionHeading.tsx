import { css } from '@emotion/react';
import { from, space, titlepiece42 } from '@guardian/source/foundations';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import HighlightText from '../../../../components/HighlightText';

const headerTitleText = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 40px;
	}
`;
const supCss = css`
	font-size: 60%;
	vertical-align: 9px;
	${from.tablet} {
		font-size: 60%;
		vertical-align: 14px;
	}
`;

const promoMessage = css`
	margin-top: ${space[2]}px;
`;

const getFrequencyFromRatePlanKey = (
	ratePlanKey: ActiveRatePlanKey,
): string | null => {
	switch (ratePlanKey) {
		case 'Monthly':
			return 'each month';
		case 'Annual':
			return 'each year';
		default:
			return null;
	}
};

export default function ContributionHeading({
	name,
	amount,
	ratePlanKey,
	isoCurrency,
	promotion,
}: {
	name: string;
	amount: number;
	ratePlanKey: ActiveRatePlanKey;
	isoCurrency: IsoCurrency;
	promotion?: Promotion;
}) {
	const frequency = getFrequencyFromRatePlanKey(ratePlanKey);
	const amountWithCurrency = simpleFormatAmount(
		getCurrencyInfo(isoCurrency),
		amount,
	);
	const promotionPrice = promotion?.discountedPrice ?? 0;
	const promotionDuration = promotion?.discount?.durationMonths ?? 0;
	const promotionPriceWithCurrency = simpleFormatAmount(
		getCurrencyInfo(isoCurrency),
		promotionPrice,
	);

	return (
		<>
			<h1 css={headerTitleText}>
				Thank you <span data-qm-masking="blocklist">{name}</span> for supporting
				us with{' '}
				<HighlightText>
					{promotion ? promotionPriceWithCurrency : amountWithCurrency}
				</HighlightText>
				&nbsp;
				{frequency}
				{promotion && <sup css={supCss}>*</sup>}
			</h1>
			{promotion && (
				<p css={promoMessage}>
					<sup>*</sup>
					{ratePlanKey === 'Monthly' &&
						`You'll pay ${promotionPriceWithCurrency}/month for the first ${promotionDuration} months, then ${amountWithCurrency}/month afterwards unless you cancel.`}
					{ratePlanKey === 'Annual' &&
						`You'll pay ${promotionPriceWithCurrency}/year for the first year, then ${amountWithCurrency}/year afterwards unless you cancel.`}
				</p>
			)}
		</>
	);
}
