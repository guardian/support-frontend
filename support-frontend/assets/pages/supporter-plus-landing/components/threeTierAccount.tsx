import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { BenefitPill } from 'components/checkoutBenefits/benefitPill';
import type { CardTheme } from 'helpers/landingPage/cardTheme';

type ThreeTierAccountProps = {
	productKey: ProductKey;
	cardTheme: CardTheme;
};
export function ThreeTierAccount({
	productKey,
	cardTheme,
}: ThreeTierAccountProps): JSX.Element | null {
	const isDigitalSubscription = productKey === 'DigitalSubscription';
	const accountNumberCopy = isDigitalSubscription
		? '4 accounts'
		: productKey === 'SupporterPlus'
		? '1 account'
		: undefined;
	return accountNumberCopy ? (
		<div>
			{isDigitalSubscription && (
				<BenefitPill copy={'New'} pillColor={cardTheme.benefitPillColor} />
			)}
			{accountNumberCopy}
		</div>
	) : null;
}
