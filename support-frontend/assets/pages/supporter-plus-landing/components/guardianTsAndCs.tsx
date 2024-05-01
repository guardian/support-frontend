import { css } from '@emotion/react';
import { from, space } from '@guardian/source-foundations';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { CheckoutDivider } from './checkoutDivider';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';
import { PaymentTsAndCs } from './paymentTsAndCs';

const guardianTsAndCsStyles = (displayPatronsCheckout: boolean) => css`
	margin-top: ${space[3]}px;
	margin-bottom: ${space[6]}px;
	${from.tablet} {
		margin-bottom: 64px;
	}
	${from.desktop} {
		${displayPatronsCheckout ? 'margin-top: 100px;' : ''}
	}
`;

export function GuardianTsAndCs({
	mobileTheme = 'dark',
	displayPatronsCheckout = true,
	billingPeriod,
	countryGroupId,
	currency,
	amount,
	productType,
	promotion,
}: {
	mobileTheme?: FinePrintTheme;
	displayPatronsCheckout: boolean;
	billingPeriod: BillingPeriod;
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	amount: number;
	productType: string;
	promotion?: Promotion;
}): JSX.Element {
	return (
		<FinePrint
			mobileTheme={mobileTheme}
			cssOverrides={guardianTsAndCsStyles(displayPatronsCheckout)}
		>
			<PaymentTsAndCs
				countryGroupId={countryGroupId}
				contributionType={billingPeriod === 'Monthly' ? 'MONTHLY' : 'ANNUAL'}
				currency={currency}
				amount={amount}
				amountIsAboveThreshold={productType === 'SupporterPlus'}
				productNameAboveThreshold={productType}
				promotion={promotion}
			/>
			<CheckoutDivider spacing="tight" mobileTheme={'light'} />
			<p>
				The ultimate owner of the Guardian is The Scott Trust Limited, whose
				role it is to secure the editorial and financial independence of the
				Guardian in perpetuity. Reader payments support the Guardian’s
				journalism. Please note that your support does not constitute a
				charitable donation, so it is not eligible for Gift Aid in the UK nor a
				tax-deduction elsewhere.
			</p>
		</FinePrint>
	);
}
