import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { InfoSummary } from '@guardian/source-development-kitchen/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PaperProductOptions } from '@modules/product/productOptions';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import {
	OrderSummaryStartDate,
	OrderSummaryTsAndCs,
} from 'components/orderSummary/orderSummaryTsAndCs';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { isContributionsOnlyCountry } from 'helpers/contributions';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { fromCountryGroupId } from 'helpers/internationalisation/currency';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
	productCatalogDescriptionNewBenefits,
} from 'helpers/productCatalog';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getLowerProductBenefitThreshold } from 'helpers/supporterPlus/benefitsThreshold';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { displayPaperProductTabs } from 'pages/paper-subscription-landing/helpers/displayPaperProductTabs';
import { getTitle } from 'pages/paper-subscription-landing/helpers/products';
import { getPaperRatePlanBenefits } from 'pages/paper-subscription-landing/planData';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { formatUserDate } from '../../../helpers/utilities/dateConversions';
import { getTierThreeDeliveryDate } from '../../weekly-subscription-checkout/helpers/deliveryDays';
import {
	getBenefitsChecklistFromLandingPageTool,
	getBenefitsChecklistFromProductDescription,
} from '../checkout/helpers/benefitsChecklist';
import { getProductFields } from '../checkout/helpers/getProductFields';
import type { CheckoutSession } from '../checkout/helpers/stripeCheckoutSession';
import { BackButton } from './backButton';
import { shorterBoxMargin } from './form';

type CheckoutSummaryProps = {
	geoId: GeoId;
	appConfig: AppConfig;
	stripePublicKey: string;
	isTestUser: boolean;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	originalAmount: number;
	discountedAmount?: number;
	contributionAmount?: number;
	finalAmount: number;
	promotion?: Promotion;
	useStripeExpressCheckout: boolean;
	countryId: IsoCountry;
	forcedCountry?: string;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
	checkoutSession?: CheckoutSession;
	clearCheckoutSession: () => void;
};

export default function CheckoutComponent({
	geoId,
	appConfig,
	productKey,
	ratePlanKey,
	originalAmount,
	contributionAmount,
	finalAmount,
	promotion,
	countryId,
	forcedCountry,
	abParticipations,
	landingPageSettings,
}: CheckoutSummaryProps) {
	const urlParams = new URLSearchParams(window.location.search);
	const showBackButton = urlParams.get('backButton') !== 'false';

	const isPaper = ['HomeDelivery', 'SubscriptionCard'].includes(productKey);
	const showPaperProductTabs = isPaper && displayPaperProductTabs();

	const productCatalog = appConfig.productCatalog;
	const { currency, currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const showNewspaperArchiveBenefit = ['v1', 'v2', 'control'].includes(
		abParticipations.newspaperArchiveBenefit ?? '',
	);

	const productDescription = showNewspaperArchiveBenefit
		? productCatalogDescriptionNewBenefits(countryGroupId)[productKey]
		: productCatalogDescription[productKey];
	const ratePlanDescription = productDescription.ratePlans[ratePlanKey] ?? {
		billingPeriod: BillingPeriod.Monthly,
	};
	const isRecurringContribution = productKey === 'Contribution';

	const productFields = getProductFields({
		product: {
			productKey,
			productDescription,
			ratePlanKey,
			deliveryAgent: undefined,
		},
		financial: {
			currencyKey,
			finalAmount,
			originalAmount,
			contributionAmount,
		},
	});

	/**
	 * Is It a Contribution? URL queryPrice supplied?
	 *    If queryPrice above ratePlanPrice, in a upgrade to S+ country, invalid amount
	 */
	let isInvalidAmount = false;
	if (isRecurringContribution) {
		const supporterPlusRatePlanPrice =
			productCatalog.SupporterPlus?.ratePlans[ratePlanKey]?.pricing[
				currencyKey
			];

		const { selectedAmountsVariant } = getAmountsTestVariant(
			countryId,
			countryGroupId,
			appConfig.settings,
		);
		if (originalAmount < 1) {
			isInvalidAmount = true;
		}
		if (!isContributionsOnlyCountry(selectedAmountsVariant)) {
			if (originalAmount >= (supporterPlusRatePlanPrice ?? 0)) {
				isInvalidAmount = true;
			}
		}
	}

	if (isInvalidAmount) {
		return <div>Invalid Amount {originalAmount}</div>;
	}

	const billingPeriod = productFields.billingPeriod;
	/*
  TODO :  Passed down because minimum product prices are unavailable in the paymentTsAndCs story
          We should revisit this and see if we can remove this prop, pushing it lower down the tree
  */
	const thresholdAmount = getLowerProductBenefitThreshold(
		billingPeriod,
		fromCountryGroupId(countryGroupId),
		countryGroupId,
		productKey,
		ratePlanKey,
	);

	const paperPlusDigitalBenefits = showPaperProductTabs
		? getPaperRatePlanBenefits(ratePlanKey as PaperProductOptions)
		: undefined;
	const benefitsCheckListData =
		paperPlusDigitalBenefits ??
		getBenefitsChecklistFromLandingPageTool(productKey, landingPageSettings) ??
		getBenefitsChecklistFromProductDescription(
			productDescription,
			countryGroupId,
			abParticipations,
		);

	return (
		<Box cssOverrides={shorterBoxMargin}>
			<BoxContents>
				{forcedCountry && productDescription.deliverableTo?.[forcedCountry] && (
					<div role="alert">
						<InfoSummary
							cssOverrides={css`
								margin-bottom: ${space[6]}px;
							`}
							message={`You've changed your delivery country to ${productDescription.deliverableTo[forcedCountry]}.`}
							context={`Your subscription price has been updated to reflect the rates in your new location.`}
						/>
					</div>
				)}
				<ContributionsOrderSummary
					productKey={productKey}
					productDescription={productDescription.label}
					ratePlanKey={ratePlanKey}
					ratePlanDescription={
						ratePlanDescription.label ??
						getTitle(ratePlanKey as PaperProductOptions)
					}
					paymentFrequency={getBillingPeriodNoun(
						ratePlanDescription.billingPeriod,
					)}
					amount={originalAmount}
					promotion={promotion}
					currency={currency}
					checkListData={benefitsCheckListData}
					onCheckListToggle={(isOpen) => {
						trackComponentClick(
							`contribution-order-summary-${isOpen ? 'opened' : 'closed'}`,
						);
					}}
					enableCheckList={true}
					startDate={
						<OrderSummaryStartDate
							productKey={productKey}
							startDate={formatUserDate(getTierThreeDeliveryDate())}
						/>
					}
					tsAndCs={
						<OrderSummaryTsAndCs
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							countryGroupId={countryGroupId}
							thresholdAmount={thresholdAmount}
							promotion={promotion}
						/>
					}
					headerButton={
						showBackButton && (
							<BackButton
								path={`/${geoId}${productDescription.landingPagePath}`}
								buttonText={'Change'}
							/>
						)
					}
				/>
			</BoxContents>
		</Box>
	);
}
