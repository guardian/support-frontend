import { css } from '@emotion/react';
import { from, space, titlepiece42 } from '@guardian/source/foundations';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { PaymentStatus } from 'helpers/forms/paymentMethods';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
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
	if (promotion) {
		const promotionPrice = promotion.discountedPrice ?? amount;
		const promotionDuration = promotion.discount?.durationMonths ?? 0;
		return (
			<>
				<h1 css={headerTitleText}>
					Thank you <span data-qm-masking="blocklist">{name}</span>for
					supporting us with{' '}
					<YellowHighlight amount={promotionPrice} currency={isoCurrency} />
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
						promotionPrice,
						false,
					)}
					/month for the first {promotionDuration} months, then{' '}
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
			Thank you <span data-qm-masking="blocklist">{name}</span>for supporting us
			with <YellowHighlight currency={isoCurrency} amount={amount} /> each month
			❤️
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
	if (promotion) {
		const promotionPrice = promotion.discountedPrice ?? amount;

		return (
			<>
				<h1 css={headerTitleText}>
					Thank you <span data-qm-masking="blocklist">{name}</span>for
					supporting us with{' '}
					<YellowHighlight amount={promotionPrice} currency={isoCurrency} />
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
						promotionPrice,
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
			Thank you <span data-qm-masking="blocklist">{name}</span>for supporting us
			with <YellowHighlight currency={isoCurrency} amount={amount} /> each year
			❤️
		</h1>
	);
}

const tier3lineBreak = css`
	display: none;
	${from.tablet} {
		display: inline-block;
	}
`;

const yellowAmountText = css`
	background-color: #ffe500;
	padding: 0 5px;
`;
type YellowAmountProps = {
	amount: number;
	currency: IsoCurrency;
	productName?: string;
};
function YellowHighlight({ amount, currency, productName }: YellowAmountProps) {
	return (
		<span css={yellowAmountText}>
			{!productName &&
				formatAmount(
					currencies[currency],
					spokenCurrencies[currency],
					amount,
					false,
				)}
			{productName && productName}
		</span>
	);
}

const headerTitleText = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 40px;
	}
`;
const tier3HeaderTitleText = css`
	${titlepiece42};
	font-size: 24px;
	${from.tablet} {
		font-size: 28px;
	}
`;

type HeadingProps = {
	name: string | null;
	productKey: ActiveProductKey;
	isOneOffPayPal: boolean;
	amount: number | undefined;
	currency: IsoCurrency;
	contributionType: ContributionType;
	ratePlanKey?: string;
	paymentStatus?: PaymentStatus;
	promotion?: Promotion;
};
function Heading({
	name,
	productKey,
	isOneOffPayPal,
	amount,
	currency,
	contributionType,
	ratePlanKey,
	paymentStatus,
	promotion,
}: HeadingProps): JSX.Element {
	const isPending = paymentStatus === 'pending';
	const isDigitalEdition = productKey === 'DigitalSubscription';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isTier3 = productKey === 'TierThree';
	const isPaperOrGuardianWeekly = [
		'NationalDelivery',
		'HomeDelivery',
		'GuardianWeekly',
		'GuardianWeeklyRestOfWorld',
		'SubscriptionCard',
	]
		.map((product) => productKey === product)
		.includes(true);
	const maybeNameAndTrailingSpace: string =
		name && name.length < 10 ? `${name} ` : '';
	const maybeNameAndCommaSpace: string =
		name && name.length < 10 ? `, ${name}, ` : '';

	// Do not show special header to paypal/one-off as we don't have the relevant info after the redirect
	if (isOneOffPayPal || !amount || isPending) {
		const headerTitleClosure = isPending
			? 'your recurring subscription is being processed'
			: 'your valuable contribution';

		return (
			<h1 css={headerTitleText}>
				Thank you{' '}
				<span data-qm-masking="blocklist">{maybeNameAndTrailingSpace}</span>
				{headerTitleClosure}
			</h1>
		);
	}

	if (isDigitalEdition) {
		return (
			<h1 css={headerTitleText}>
				Thank you
				<span data-qm-masking="blocklist">{maybeNameAndCommaSpace}</span>
				{'for subscribing to the Digital Edition'}
			</h1>
		);
	}

	if (isTier3 || isGuardianAdLite) {
		return (
			<h1 css={tier3HeaderTitleText}>
				Thank you{' '}
				<span data-qm-masking="blocklist">{maybeNameAndTrailingSpace}</span>for
				subscribing to{' '}
				<YellowHighlight
					currency={currency}
					amount={amount}
					productName={isTier3 ? 'Digital + print.' : 'Guardian Ad-Lite.'}
				/>
				{isTier3 && (
					<>
						<br css={tier3lineBreak} />
						'Your valued support powers our journalism.'
					</>
				)}
			</h1>
		);
	}

	if (isPaperOrGuardianWeekly) {
		const getPrintTitle = (productOption?: string) => {
			switch (productOption) {
				case 'Sixday':
					return 'Six day';
				case 'Everyday':
					return 'Every day';
				default:
					return productOption;
			}
		};
		return (
			<h1 css={headerTitleText}>
				Thank you for supporting our journalism! You have now subscribed to the{' '}
				{getPrintTitle(ratePlanKey)} package
			</h1>
		);
	}

	switch (contributionType) {
		case 'ONE_OFF':
			return (
				<h1 css={headerTitleText}>
					Thank you for supporting us today with{' '}
					<YellowHighlight currency={currency} amount={amount} /> ❤️
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
					Thank you{' '}
					<span data-qm-masking="blocklist">{maybeNameAndTrailingSpace}</span>
					for your valuable contribution
				</h1>
			);
	}
}

export default Heading;
