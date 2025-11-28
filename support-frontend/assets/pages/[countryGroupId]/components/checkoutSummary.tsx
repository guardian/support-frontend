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
	getProductDescription,
} from 'helpers/productCatalog';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { parameteriseUrl } from 'helpers/urls/routes';
import { getOriginAndForceSubdomain } from 'helpers/urls/url';
import { isGuardianWeeklyGiftProduct } from 'pages/[countryGroupId]/helpers/productMatchers';
import type { CheckoutNudgeSettings } from '../../../helpers/abTests/checkoutNudgeAbTests';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { formatUserDate } from '../../../helpers/utilities/dateConversions';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import {
	getBenefitsChecklistFromLandingPageTool,
	getBenefitsChecklistFromProductDescription,
	getPaperPlusDigitalBenefits,
	getPremiumDigitalAllBenefits,
} from '../checkout/helpers/benefitsChecklist';
import { ukSpecificAdditionalBenefit } from '../student/components/StudentHeader';
import type { StudentDiscount } from '../student/helpers/discountDetails';
import { BackButton } from './backButton';
import { shorterBoxMargin } from './form';

const alertStyles = css`
	margin-bottom: ${space[6]}px;
`;

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
	nudgeSettings?: CheckoutNudgeSettings;
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
	nudgeSettings,
}: CheckoutSummaryProps) {
	const urlParams = new URLSearchParams(window.location.search);
	const showBackButton = urlParams.get('backButton') !== 'false';
	const productCatalog = appConfig.productCatalog;
	const { currency, currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	const { enablePremiumDigital } = getFeatureFlags();
	const productDescription = getProductDescription(productKey, ratePlanKey);
	const ratePlanDetail = productDescription.ratePlans[ratePlanKey] ?? {
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

	const premiumDigitalBenefits =
		productKey === 'DigitalSubscription' && enablePremiumDigital
			? getPremiumDigitalAllBenefits(countryGroupId)
			: undefined;
	const benefitsCheckListData =
		premiumDigitalBenefits ??
		getPaperPlusDigitalBenefits(productKey, ratePlanKey) ??
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

	// We need to force the subdomain to support in case we're on the Observer
	// subdomain which can't serve the subscribe/paper landing page. This is for
	// Sunday paper subs.
	const backUrl =
		getOriginAndForceSubdomain('support') +
		parameteriseUrl(
			`/${supportRegionId}${productDescription.landingPagePath}`,
			promotion?.promoCode,
			getPaperFulfilmentOption(productKey),
		);

	return (
		<Box cssOverrides={shorterBoxMargin}>
			<BoxContents>
				{forcedCountry && productDescription.deliverableTo?.[forcedCountry] && (
					<div role="alert" css={alertStyles}>
						<InfoSummary
							message={`You've changed your delivery country to ${productDescription.deliverableTo[forcedCountry]}.`}
							context={`Your subscription price has been updated to reflect the rates in your new location.`}
						/>
					</div>
				)}
				{supportRegionId === SupportRegionId.CA &&
					productKey === 'GuardianWeeklyDomestic' && (
						<div role="alert" css={alertStyles}>
							<InfoSummary
								message="For Canadian residents only"
								context="Please note that Canada Post is currently undergoing a period of industrial action. If you start a Guardian Weekly subscription today, the delivery of your copies may be subject to delays. We apologise for any inconvenience this may cause."
							/>
						</div>
					)}
				<ContributionsOrderSummary
					productKey={productKey}
					productLabel={productDescription.label}
					ratePlanKey={ratePlanKey}
					ratePlanLabel={ratePlanDetail.displayName ?? ratePlanDetail.label}
					paymentFrequency={getBillingPeriodNoun(
						ratePlanDetail.billingPeriod,
						isGuardianWeeklyGiftProduct(productKey, ratePlanKey),
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
							ratePlanDescription={ratePlanDetail.label}
							countryGroupId={countryGroupId}
							thresholdAmount={thresholdAmount}
							promotion={promotion}
							deliveryDate={
								isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
									? weeklyDeliveryDate
									: undefined
							}
						/>
					}
					headerButton={
						showBackButton && (
							<BackButton path={backUrl} buttonText={'Change'} />
						)
					}
					studentDiscount={studentDiscount}
					supportRegionId={supportRegionId}
					nudgeSettings={nudgeSettings}
					landingPageSettings={landingPageSettings}
				/>
			</BoxContents>
		</Box>
	);
}
