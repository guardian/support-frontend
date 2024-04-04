import { css } from '@emotion/react';
import { from, space, titlepiece } from '@guardian/source-foundations';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';

const supCss = css`
	font-size: 60%;
	vertical-align: 9px;
	${from.tablet} {
		font-size: 60%;
		vertical-align: 14px;
	}
`;
type MonthlyProps = {
	amount: number;
	isoCurrency: IsoCurrency;
	promotion?: Promotion;
	name?: string;
};
function Monthly({ isoCurrency, amount, promotion, name }: MonthlyProps) {
	if (
		/**
		 * This is a check to see if the promo exists,
		 * it's a little odd due to the type having
		 * every prop optional.
		 *
		 * We could/should do some parsing pre-render to avoid this.
		 * */
		promotion?.discountedPrice &&
		promotion.discount?.durationMonths
	) {
		return (
			<>
				<h1 css={headerTitleText}>
					Thank you {name}for supporting us with{' '}
					<YellowAmount
						amount={promotion.discountedPrice}
						currency={isoCurrency}
					/>
					{`/month`}
					<sup css={supCss}>*</sup>
				</h1>
				<p
					css={css`
						margin-top: ${space[2]}px;
					`}
				>
					<sup>*</sup> You'll pay{' '}
					{formatAmount(
						currencies[isoCurrency],
						spokenCurrencies[isoCurrency],
						promotion.discountedPrice,
						false,
					)}
					/month for the first {promotion.discount.durationMonths} months, then{' '}
					{formatAmount(
						currencies[isoCurrency],
						spokenCurrencies[isoCurrency],
						amount,
						false,
					)}
					/month afterwards unless you cancel.
				</p>
			</>
		);
	}

	return (
		<h1 css={headerTitleText}>
			Thank you {name}for supporting us with{' '}
			<YellowAmount currency={isoCurrency} amount={amount} /> each month ❤️
		</h1>
	);
}

type AnnualProps = {
	amount: number;
	isoCurrency: IsoCurrency;
	promotion?: Promotion;
	name?: string;
};
function Annual({ isoCurrency, amount, promotion, name }: AnnualProps) {
	if (
		/**
		 * This is a check to see if the promo exists,
		 * it's a little odd due to the type having
		 * every prop optional.
		 *
		 * We could/should do some parsing pre-render to avoid this.
		 * */
		promotion?.discountedPrice &&
		promotion.discount?.durationMonths
	) {
		return (
			<>
				<h1 css={headerTitleText}>
					Thank you {name}for supporting us with{' '}
					<YellowAmount
						amount={promotion.discountedPrice}
						currency={isoCurrency}
					/>
					{`/year`}
					<sup css={supCss}>*</sup>
				</h1>
				<p
					css={css`
						margin-top: ${space[2]}px;
					`}
				>
					<sup>*</sup> You'll pay{' '}
					{formatAmount(
						currencies[isoCurrency],
						spokenCurrencies[isoCurrency],
						promotion.discountedPrice,
						false,
					)}
					{/**
					 * We'll assume that yearly promotions are always 12 months.
					 * if not this will look weird, but we can work out what we would
					 * like to do if that becomes a usecase
					 **/}
					/year for the first year, then{' '}
					{formatAmount(
						currencies[isoCurrency],
						spokenCurrencies[isoCurrency],
						amount,
						false,
					)}
					/year afterwards unless you cancel.
				</p>
			</>
		);
	}

	return (
		<h1 css={headerTitleText}>
			Thank you {name}for supporting us with{' '}
			<YellowAmount currency={isoCurrency} amount={amount} /> each year ❤️
		</h1>
	);
}

const yellowAmountText = css`
	background-color: #ffe500;
	padding: 0 5px;
`;
type YellowAmountProps = {
	amount: number;
	currency: IsoCurrency;
};
function YellowAmount({ amount, currency }: YellowAmountProps) {
	return (
		<span css={yellowAmountText}>
			{formatAmount(
				currencies[currency],
				spokenCurrencies[currency],
				amount,
				false,
			)}
		</span>
	);
}

const headerTitleText = css`
	${titlepiece.small()};
	font-size: 24px;
	${from.tablet} {
		font-size: 40px;
	}
`;
type HeadingProps = {
	name: string | null;
	isOneOffPayPal: boolean;
	amount: number | undefined;
	currency: IsoCurrency;
	contributionType: ContributionType;
	promotion?: Promotion;
};
function Heading({
	name,
	isOneOffPayPal,
	amount,
	currency,
	contributionType,
	promotion,
}: HeadingProps): JSX.Element {
	const maybeNameAndTrailingSpace: string =
		name && name.length < 10 ? `${name} ` : '';

	// Do not show special header to paypal/one-off as we don't have the relevant info after the redirect
	if (isOneOffPayPal || !amount) {
		return (
			<h1 css={headerTitleText}>
				Thank you {maybeNameAndTrailingSpace}for your valuable contribution
			</h1>
		);
	}

	switch (contributionType) {
		case 'ONE_OFF':
			return (
				<h1 css={headerTitleText}>
					Thank you for supporting us today with{' '}
					<YellowAmount currency={currency} amount={amount} /> ❤️
				</h1>
			);

		case 'MONTHLY':
			return (
				<Monthly
					amount={amount}
					isoCurrency={currency}
					promotion={promotion}
					name={maybeNameAndTrailingSpace}
				/>
			);

		case 'ANNUAL':
			return (
				<Annual
					amount={amount}
					isoCurrency={currency}
					promotion={promotion}
					name={maybeNameAndTrailingSpace}
				/>
			);

		default:
			return (
				<h1 css={headerTitleText}>
					Thank you {maybeNameAndTrailingSpace}for your valuable contribution
				</h1>
			);
	}
}

export default Heading;
