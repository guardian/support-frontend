import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	currencies,
	detect,
	glyph,
} from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	type FulfilmentOptions,
	NoFulfilmentOptions,
} from 'helpers/productPrice/fulfilmentOptions';
import {
	NoProductOptions,
	type ProductOptions,
} from 'helpers/productPrice/productOptions';
import {
	getCountryGroup,
	type ProductPrices,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { getUserSelectedAmount } from 'helpers/redux/checkout/product/selectors/selectedAmount';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { lowerBenefitsThresholds } from 'helpers/supporterPlus/benefitsThreshold';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { ContributionsOrderSummaryProps } from './contributionsOrderSummary';

type ContributionsOrderSummaryContainerProps = {
	inThreeTier: boolean;
	renderOrderSummary: (props: ContributionsOrderSummaryProps) => JSX.Element;
	promotion?: Promotion;
};

const thresholdDescription = (
	countryGroupId: CountryGroupId,
	contributionType: RegularContributionType,
	divider: string,
	promotion?: Promotion,
	beforeCopy?: string,
	afterCopy?: string,
) => {
	const currencyGlyph = glyph(detect(countryGroupId));
	const tierPlanCost = `${currencyGlyph}${lowerBenefitsThresholds[countryGroupId][contributionType]}`;
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';
	const planCostNoPromo = `${tierPlanCost}${divider}${period}${
		afterCopy ?? ''
	}`;
	if (promotion) {
		if (promotion.discountedPrice && promotion.numberOfDiscountedPeriods) {
			// EXAMPLE: £16/month for the first 12 months, then £25/month
			const discountTierPlanCost = `${currencyGlyph}${promotion.discountedPrice}`;
			const discountDuration = promotion.numberOfDiscountedPeriods;
			return `${
				beforeCopy ?? ''
			}${discountTierPlanCost}${divider}${period} for the first ${
				discountDuration > 1 ? discountDuration : ''
			} ${period}${discountDuration > 1 ? 's' : ''}, then ${planCostNoPromo}`;
		}
	}
};

function getTermsConditions(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
	isSupporterPlus: boolean,
	promotion?: Promotion,
) {
	if (contributionType === 'ONE_OFF') return;
	const period = contributionType === 'MONTHLY' ? 'month' : 'year';

	if (isSupporterPlus) {
		return (
			<>
				<p>
					{thresholdDescription(
						countryGroupId,
						contributionType,
						'/',
						promotion,
						`You’ll pay `,
						` afterwards unless you cancel. Offer only available to new subscribers who do not have an existing subscription with the Guardian.`,
					)}
				</p>
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

function getProductPrice(
	productPrices: ProductPrices,
	productPriceWithPromo: number,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
): number | undefined {
	const countryGroup = getCountryGroup(country);
	const productPrice =
		productPrices[countryGroup.name]?.[fulfilmentOption]?.[productOption]?.[
			billingPeriod
		]?.[countryGroup.currency]?.price ?? 0;
	return productPrice > productPriceWithPromo ? productPrice : undefined;
}

export function ContributionsOrderSummaryContainer({
	inThreeTier,
	renderOrderSummary,
	promotion,
}: ContributionsOrderSummaryContainerProps): JSX.Element {
	const contributionType = useContributionsSelector(getContributionType);

	const { countryId, currencyId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { productType } = useContributionsSelector(
		(state) => state.page.checkoutForm.product,
	);
	const billingPeriod = (productType[0] +
		productType.slice(1).toLowerCase()) as BillingPeriod;
	const productPriceWithPromo = useContributionsSelector(getUserSelectedAmount);
	const productPrice = useContributionsSelector((state) =>
		getProductPrice(
			state.page.checkoutForm.product.productPrices,
			productPriceWithPromo,
			countryId,
			billingPeriod,
		),
	);

	const isSupporterPlus = useContributionsSelector(isSupporterPlusFromState);

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
		total: productPriceWithPromo,
		totalExcludingPromo: isSupporterPlus ? productPrice : undefined,
		currency: currency,
		paymentFrequency,
		enableCheckList: contributionType !== 'ONE_OFF',
		checkListData: checklist,
		onCheckListToggle,
		threeTierProductName: threeTierProductName(),
		tsAndCs: getTermsConditions(
			countryGroupId,
			contributionType,
			isSupporterPlus,
			promotion,
		),
	});
}
