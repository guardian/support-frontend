import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/utils';
import { neutral, space, textSans17 } from '@guardian/source/foundations';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { productCatalogDescription } from 'helpers/productCatalog';
import type { ActiveProductKey } from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import type { FinePrintTheme } from './finePrint';
import TsAndCsRenewal from './TsAndCsRenewal';

const containerSummaryTsCs = css`
	margin-top: ${space[6]}px;
	border-radius: ${space[2]}px;
	background-color: ${neutral[97]};
	padding: ${space[3]}px;
	${textSans17};
	color: ${neutral[0]};
	& a {
		color: ${neutral[7]};
	}
`;

interface SummaryTsAndCsProps {
	mobileTheme?: FinePrintTheme;
	contributionType: ContributionType;
	currency: IsoCurrency;
	amount: number;
	productKey: ActiveProductKey;
	promotion?: Promotion;
	cssOverrides?: SerializedStyles;
}

const frequencySingular = (contributionType: ContributionType) =>
	contributionType === 'MONTHLY' ? 'month' : 'year';

export function SummaryTsAndCs({
	contributionType,
	currency,
	amount,
	productKey,
	cssOverrides,
}: SummaryTsAndCsProps): JSX.Element {
	const inDigitalEdition = productKey === 'DigitalSubscription';
	const inAdLite = productKey === 'GuardianAdLite';
	const inDigitalPlusPrint = productKey === 'TierThree';
	const inAllAccessDigital = productKey === 'SupporterPlus';
	const inSupport =
		productKey === 'Contribution' ||
		!(inAllAccessDigital || inDigitalPlusPrint || inAdLite);

	const amountCopy = ` of ${formatAmount(
		currencies[currency],
		spokenCurrencies[currency],
		amount,
		false,
	)}`;

	const copyTier1 = (contributionType: ContributionType) => {
		return (
			<>
				<div>
					We will attempt to take payment{amountCopy},{' '}
					<TsAndCsRenewal contributionType={contributionType} />, from now until
					you cancel your payment. Payments may take up to 6 days to be recorded
					in your bank account. You can change how much you give or cancel your
					payment at any time.
				</div>
			</>
		);
	};

	const copyTier2 = (
		contributionType: ContributionType,
		productKey: ActiveProductKey,
	) => {
		return (
			<>
				<div>
					The {productCatalogDescription[productKey].label} subscription and any
					contribution will auto-renew each{' '}
					{frequencySingular(contributionType)}. You will be charged the
					subscription and contribution amounts using your chosen payment method
					at each renewal, at the rate then in effect, unless you cancel.
				</div>
			</>
		);
	};

	const copyTier3 = (
		contributionType: ContributionType,
		productKey: ActiveProductKey,
		plural: boolean,
	) => {
		return (
			<>
				<div>
					The {productCatalogDescription[productKey].label} subscription
					{plural ? 's' : ''} will auto-renew each{' '}
					{frequencySingular(contributionType)}. You will be charged the
					subscription amount using your chosen payment method at each renewal,
					at the rate then in effect, unless you cancel.
				</div>
			</>
		);
	};

	return (
		<>
			{!inDigitalEdition && (
				<div css={[containerSummaryTsCs, cssOverrides]}>
					{inSupport && copyTier1(contributionType)}
					{inAllAccessDigital && copyTier2(contributionType, productKey)}
					{inDigitalPlusPrint && copyTier3(contributionType, productKey, true)}
					{inAdLite && copyTier3(contributionType, productKey, false)}
				</div>
			)}
		</>
	);
}
