import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isPrintProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

interface CancellationPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	countryGroupId: CountryGroupId;
	currency: CurrencyCode;
	amount: number;
	promotion?: Promotion;
}
export function CancellationPolicy({
	productKey,
	ratePlanKey,
	countryGroupId,
	currency,
	amount,
	promotion,
}: CancellationPolicyProps): JSX.Element | null {
	const isPrint = isPrintProduct(productKey);
	const copyPrint =
		'Cancel anytime, via your account. Cancel within 14 days of sign-up or each renewal and receive a full refund of your last payment. See more about your cooling-off rights in your full pre-contract information here.';
	const copyDigital =
		'You can cancel anytime, via your account. You can cancel within 14 days of sign-up and receive a full refund. You can also cancel within 14 days of your first payment at £XXX and receive a full refund of that payment. See your full pre-contract details, including more information about your cooling-off rights here.';
	return (
		<p css={marginTop}>
			{isPrint ? copyPrint : copyDigital}
			{ratePlanKey} {countryGroupId},{currency},{amount}
			{promotion && JSON.stringify(promotion)},
		</p>
	);
}
