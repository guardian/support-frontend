import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import type { ContributionType } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { currencies } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { getCountryGroup } from 'helpers/productPrice/productPrices';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { isSupporterPlusPurchase } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { ContributionsOrderSummaryProps } from './contributionsOrderSummary';

type ContributionsOrderSummaryContainerProps = {
	inThreeTier: boolean;
	renderOrderSummary: (props: ContributionsOrderSummaryProps) => JSX.Element;
};

function getTermsConditions(
	contributionType: ContributionType,
	isSupporterPlus: boolean,
) {
	if (contributionType === 'ONE_OFF') return;
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';

	if (isSupporterPlus) {
		return (
			<>
				<p>Auto renews every {period} until you cancel.</p>
				<p>
					Cancel or change your support anytime. If you cancel within the first
					14 days, you will receive a full refund.
				</p>
			</>
		);
	}
	return (
		<>
			<p>Auto renews every {period} until you cancel.</p>
			<p>Cancel or change your support anytime.</p>
		</>
	);
}

export function ContributionsOrderSummaryContainer({
	inThreeTier,
	renderOrderSummary,
}: ContributionsOrderSummaryContainerProps): JSX.Element {
	const contributionType = useContributionsSelector(getContributionType);

	const { countryId, currencyId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const currentPrice = useContributionsSelector(getUserSelectedAmount);
	const originalPrice = useContributionsSelector((state) =>
		getOriginalPrice(
			state.page.checkoutForm.product.productPrices,
			countryId,
			state.page.checkoutForm.product.billingPeriod,
		),
	);

	function getOriginalPrice(
		productPrices: ProductPrices,
		country: IsoCountry,
		billingPeriod: BillingPeriod,
		fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
		productOption: ProductOptions = NoProductOptions,
	): number | undefined {
		const countryGroup = getCountryGroup(country);
		const originalPrice =
			productPrices[countryGroup.name]?.[fulfilmentOption]?.[productOption]?.[
				billingPeriod
			]?.[countryGroup.currency]?.price ?? 0;
		return originalPrice > currentPrice ? originalPrice : undefined;
	}

	const isSupporterPlus = useContributionsSelector(isSupporterPlusPurchase);

	const currency = currencies[currencyId];

	const checklist =
		contributionType === 'ONE_OFF'
			? []
			: checkListData({
					higherTier: isSupporterPlus,
			  });

	function onCheckListToggle(isOpen: boolean) {
		trackComponentClick(
			`contribution-order-summary-${isOpen ? 'opened' : 'closed'}`,
		);
	}

	const threeTierProductName = (): string | undefined => {
		if (inThreeTier) {
			if (isSupporterPlus) {
				return 'All-access digital';
			} else {
				return 'Support';
			}
		}
	};

	let description;
	let paymentFrequency;
	if (contributionType === 'ONE_OFF') {
		description = 'One-time support';
	} else if (contributionType === 'MONTHLY') {
		description = 'Monthly support';
		paymentFrequency = 'month';
	} else {
		// The if (contributionType === 'ANNUAL') condition would be here
		// but typescript errors on it being unnecessary due to it always being truthy
		description = 'Annual support';
		paymentFrequency = 'year';
	}

	return renderOrderSummary({
		description,
		total: currentPrice,
		totalOriginal: originalPrice,
		currency: currency,
		paymentFrequency,
		enableCheckList: contributionType !== 'ONE_OFF',
		checkListData: checklist,
		onCheckListToggle,
		threeTierProductName: threeTierProductName(),
		tsAndCs: getTermsConditions(contributionType, isSupporterPlus),
	});
}
