import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import { glyph } from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

interface RenewalTermsPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	currency: CurrencyCode;
	amount: number;
	promotion?: Promotion;
}
export function RenewalTermsPolicy({
	productKey,
	ratePlanKey,
	currency,
	amount,
	promotion,
}: RenewalTermsPolicyProps): JSX.Element | null {
	const isOneTimeContribution =
		productKey === 'Contribution' && ratePlanKey === 'OneTime';
	const isWeeklyGift =
		ratePlanKey === 'ThreeMonthGift' || ratePlanKey === 'OneYearGift';
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent'; // TODO: UTS Students

	const display =
		!isOneTimeContribution && !isWeeklyGift && !isStudentOneYearRatePlan;

	const currencyGlyph = glyph(currency);
	const billingPeriod = getBillingPeriodNoun(
		ratePlanToBillingPeriod(ratePlanKey),
	);
	return display ? (
		<p css={marginTop}>
			Subscription auto-renews monthly. Pay {currencyGlyph}
			{amount}/ {billingPeriod}, unless you cancel. We’ll remind you every 6
			months, 2 weeks before your renewal date.
			{productKey} {ratePlanKey},{currency},{amount}
			{promotion && 'yes'},
		</p>
	) : null;
}
