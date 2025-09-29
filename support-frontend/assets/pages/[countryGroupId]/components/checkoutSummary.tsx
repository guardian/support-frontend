import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import { InfoSummary } from '@guardian/source-development-kitchen/react-components';
import type { IsoCountry } from '@modules/internationalisation/country';
import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { ContributionsOrderSummary } from 'components/orderSummary/contributionsOrderSummary';
import {
	OrderSummaryStartDate,
	OrderSummaryTsAndCs,
} from 'components/orderSummary/orderSummaryTsAndCs';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { isContributionsOnlyCountry } from 'helpers/contributions';
import { getFeatureFlags } from 'helpers/featureFlags';
import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	productCatalogDescription,
	productCatalogDescriptionNewBenefits,
	productCatalogGuardianWeeklyGift,
} from 'helpers/productCatalog';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { parameteriseUrl } from 'helpers/urls/routes';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { formatUserDate } from '../../../helpers/utilities/dateConversions';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import {
	getBenefitsChecklistFromLandingPageTool,
	getBenefitsChecklistFromProductDescription,
	getPaperPlusDigitalBenefits,
} from '../checkout/helpers/benefitsChecklist';
import { ukSpecificAdditionalBenefit } from '../student/components/StudentHeader';
import type { StudentDiscount } from '../student/helpers/discountDetails';
import { BackButton } from './backButton';
import { shorterBoxMargin } from './form';

type CheckoutSummaryProps = {
	supportRegionId: SupportRegionId;
	appConfig: AppConfig;
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	originalAmount: number;
	promotion?: Promotion;
	countryId: IsoCountry;
	forcedCountry?: string;
	abParticipations: Participations;
	landingPageSettings: LandingPageVariant;
	weeklyDeliveryDate: Date;
	thresholdAmount: number;
	studentDiscount?: StudentDiscount;
};

export default function CheckoutSummary({
	supportRegionId,
	appConfig,
	productKey,
	ratePlanKey,
	originalAmount,
	promotion,
	countryId,
	forcedCountry,
	abParticipations,
	landingPageSettings,
	weeklyDeliveryDate,
	thresholdAmount,
	studentDiscount,
}: CheckoutSummaryProps) {
	const urlParams = new URLSearchParams(window.location.search);
	const showBackButton = urlParams.get('backButton') !== 'false';
	const productCatalog = appConfig.productCatalog;
	const { currency, currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);
	const { enablePremiumDigital } = getFeatureFlags();
	const getProductDescription = () => {
		if (enablePremiumDigital) {
			return productCatalogDescriptionNewBenefits(countryGroupId)[productKey];
		}
		if (isWeeklyGift) {
			return productCatalogGuardianWeeklyGift()[productKey];
		}
		return productCatalogDescription[productKey];
	};
	const productDescription = getProductDescription();
	const ratePlanDescription = productDescription.ratePlans[ratePlanKey] ?? {
		billingPeriod: BillingPeriod.Monthly,
	};
	const isRecurringContribution = productKey === 'Contribution';

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

	const benefitsCheckListData =
		getPaperPlusDigitalBenefits(ratePlanKey, productKey) ??
		getBenefitsChecklistFromLandingPageTool(productKey, landingPageSettings) ??
		getBenefitsChecklistFromProductDescription(
			productDescription,
			countryGroupId,
			abParticipations,
		);

	if (
		ratePlanKey === 'OneYearStudent' &&
		supportRegionId === SupportRegionId.UK
	) {
		benefitsCheckListData.unshift({
			isChecked: true,
			text: ukSpecificAdditionalBenefit.copy,
		});
	}

	const getPaperFulfilmentOption = (
		productKey: ActiveProductKey,
	): PaperFulfilmentOptions | undefined => {
		switch (productKey) {
			case 'HomeDelivery':
			case 'NationalDelivery':
				return 'HomeDelivery';
			case 'SubscriptionCard':
				return 'Collection';
			default:
				return undefined;
		}
	};
	const backUrl = parameteriseUrl(
		`/${supportRegionId}${productDescription.landingPagePath}`,
		promotion?.promoCode,
		getPaperFulfilmentOption(productKey),
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
					productLabel={productDescription.label}
					ratePlanKey={ratePlanKey}
					ratePlanLabel={ratePlanDescription.label}
					paymentFrequency={getBillingPeriodNoun(
						ratePlanDescription.billingPeriod,
						isWeeklyGift,
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
							ratePlanKey={ratePlanKey}
							startDate={formatUserDate(weeklyDeliveryDate)}
						/>
					}
					tsAndCs={
						<OrderSummaryTsAndCs
							productKey={productKey}
							ratePlanKey={ratePlanKey}
							ratePlanDescription={ratePlanDescription.label}
							countryGroupId={countryGroupId}
							thresholdAmount={thresholdAmount}
							promotion={promotion}
						/>
					}
					headerButton={
						showBackButton && (
							<BackButton path={backUrl} buttonText={'Change'} />
						)
					}
					abParticipations={abParticipations}
					studentDiscount={studentDiscount}
					isWeeklyGift={isWeeklyGift}
				/>
			</BoxContents>
		</Box>
	);
}
