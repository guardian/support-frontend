import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold24,
	neutral,
	palette,
	space,
	textSans15,
	textSans17,
	until,
} from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { useEffect } from 'react';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { Country } from 'helpers/internationalisation/classes/country';
import {
	allProductPrices,
	getProductPrice,
} from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import type { CheckoutNudgeSettings } from '../../helpers/abTests/checkoutNudgeAbTests';
import type { LandingPageVariant } from '../../helpers/globalsAndSwitches/landingPageSettings';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from '../../helpers/productCatalog';
import { productCatalog } from '../../helpers/productCatalog';
import { getBenefitsChecklistFromLandingPageTool } from '../../pages/[countryGroupId]/checkout/helpers/benefitsChecklist';
import { getSupportRegionIdConfig } from '../../pages/supportRegionConfig';
import {
	BenefitsCheckList,
	type BenefitsCheckListData,
} from '../checkoutBenefits/benefitsCheckList';

const nudgeBoxOverrides = css`
	border: none;
	margin-top: ${space[3]}px;
`;

const innerBoxOverrides = css`
	display: grid;
	padding: 0px;

	${until.tablet} {
		padding: 0px;
	}

	${from.tablet} {
		padding: 0px;
	}

	${from.desktop} {
		padding: 0px;
	}
`;

const headlineOverrides = css`
	color: ${palette.brand[500]};
	${headlineBold24};
`;

const bodyCopyOverrides = css`
	margin-top: ${space[2]}px;
	${textSans15};
	font-weight: 700;
`;

const nudgeButtonOverrides = css`
	margin-top: ${space[2]}px;
	${textSans17};
	font-weight: 700;
	width: 100%;
`;

const previousPriceStrikeThrough = css`
	font-weight: 400;
	text-decoration: line-through;
`;

const benefitsContainer = css`
	margin-top: ${space[2]}px;
`;
const benefitsLabel = css`
	${textSans15};
	font-weight: 700;
	margin-bottom: ${space[2]}px;
`;

export interface CheckoutNudgeProps {
	supportRegionId: SupportRegionId;
	heading: string;
	body?: string;
	product: ActiveProductKey;
	ratePlan: ActiveRatePlanKey;
	amount: number;
	benefits?: {
		label: string;
		checkListData: BenefitsCheckListData[];
	};
	promotion?: Promotion;
}

export function CheckoutNudge({
	supportRegionId,
	heading,
	body,
	product,
	ratePlan,
	amount,
	benefits,
	promotion,
}: CheckoutNudgeProps) {
	useEffect(() => {
		trackComponentLoad('checkoutNudge');
	}, []);

	const { currency } = getSupportRegionIdConfig(supportRegionId);

	if (!(ratePlan === 'Monthly' || ratePlan === 'Annual')) {
		// Only these rate plans are currently supported
		return null;
	}
	const ratePlanDescription = ratePlan === 'Monthly' ? 'month' : 'year';

	const originalPrice = `${currency.glyph}${amount.toString()}`;
	const displayPrice = promotion?.discountedPrice
		? `${currency.glyph}${promotion.discountedPrice.toString()}`
		: originalPrice;

	const getButtonCopy = promotion?.discountedPrice ? (
		<>
			{`Support us for\u00A0`}
			<span css={previousPriceStrikeThrough}>{originalPrice}</span>
			{`\u00A0${displayPrice}/${ratePlanDescription}`}
		</>
	) : (
		`Support us for ${originalPrice}/${ratePlanDescription}`
	);

	const urlParams = new URLSearchParams({
		product,
		ratePlan,
		...(product === 'Contribution' ? { contribution: amount.toString() } : {}),
		...(promotion ? { promoCode: promotion.promoCode } : {}),
		fromNudge: 'true',
	});

	const buildCtaUrl = `checkout?${urlParams.toString()}`;

	return (
		<Box cssOverrides={nudgeBoxOverrides}>
			<BoxContents cssOverrides={innerBoxOverrides}>
				<h3 css={headlineOverrides}>{heading}</h3>
				{body && (
					<div css={bodyCopyOverrides}>
						<p>{body}</p>
					</div>
				)}
				<LinkButton
					id="id_checkoutNudge"
					cssOverrides={nudgeButtonOverrides}
					isLoading={false}
					theme={themeButtonReaderRevenueBrand}
					href={buildCtaUrl}
					onClick={() => {
						trackComponentClick('checkoutNudge');
					}}
				>
					{getButtonCopy}
				</LinkButton>
				{benefits && (
					<div css={benefitsContainer}>
						<div css={benefitsLabel}>{benefits.label}</div>
						<BenefitsCheckList
							benefitsCheckListData={benefits.checkListData}
							style="compact"
							iconColor={palette.brand[500]}
						/>
					</div>
				)}
			</BoxContents>
		</Box>
	);
}

const thankYouBoxOverrides = css`
	background-color: ${neutral[97]};
	border: none;
	margin-top: ${space[3]}px;
`;
const innerThankYouBoxOverrides = css`
	margin-bottom: 0px;
	padding-bottom: 0px;

	${until.tablet} {
		padding: ${space[3]}px;
		padding-bottom: 0px;
		margin-bottom: 0px;
	}

	${from.tablet} {
		padding: ${space[3]}px;
		padding-bottom: 0px;
		margin-bottom: 0px;
	}

	${from.desktop} {
		padding: ${space[3]}px;
		padding-bottom: 0px;
		margin-bottom: 0px;
	}
`;

const nudgeThankYouBox = css`
	display: grid;
	grid-template:
		'heading	heading'
		'copy		image';

	${from.desktop} {
		grid-template:
			'heading	image'
			'copy		image';
	}
`;

const headingOverride = css`
	grid-area: heading;
	color: ${palette.brand[500]};
	${headlineBold20};
`;

const copyOverride = css`
	grid-area: copy;
	margin-top: ${space[2]}px;
	${textSans15};
	font-weight: 700;
	padding-bottom: ${space[3]}px;
`;

const imageOverride = css`
	grid-area: image;
	justify-self: end;
	align-self: end;
	margin-left: ${space[2]}px;
	margin-top: ${space[2]}px;
`;

export interface CheckoutNudgeThankYouProps {
	heading: string;
	body?: string;
}

export function CheckoutNudgeThankYou({
	heading,
	body,
}: CheckoutNudgeThankYouProps) {
	return (
		<Box cssOverrides={thankYouBoxOverrides}>
			<BoxContents cssOverrides={innerThankYouBoxOverrides}>
				<div css={nudgeThankYouBox}>
					<h3 css={headingOverride}>{heading}</h3>
					{body && <p css={copyOverride}>{body}</p>}
					<img
						css={imageOverride}
						width="116px"
						height="91px"
						src="https://media.guim.co.uk/313aafcd2a1b8fed178628ce346b517248d8692b/0_0_702_582/140.png"
						alt="An illustration of a man watering a plant which represents The Guardian - helping it to grow"
					/>
				</div>
			</BoxContents>
		</Box>
	);
}

/**
 * Maps ActiveRatePlanKey to BillingPeriod (only Monthly and Annual are supported for promotions)
 */
const ratePlanToBillingPeriod: Partial<
	Record<ActiveRatePlanKey, BillingPeriod>
> = {
	Monthly: BillingPeriod.Monthly,
	Annual: BillingPeriod.Annual,
};

/**
 * Type guard to check if a product key exists in allProductPrices
 */
function isValidProductPriceKey(
	key: string,
): key is keyof typeof allProductPrices {
	return key in allProductPrices;
}

/**
 * The CheckoutNudgeSelector component is used on the checkout components.
 * If the current product+ratePlan matches the nudge's `fromProduct` then the nudge is displayed.
 * If the current product+ratePlan matches the nudge's `toProduct` and the 'fromNudge' query param is present then the nudge thankyou is displayed.
 */

interface CheckoutNudgeSelectorProps {
	nudgeSettings: CheckoutNudgeSettings;
	currentProduct: ActiveProductKey;
	currentRatePlan: ActiveRatePlanKey;
	supportRegionId: SupportRegionId;
	landingPageSettings: LandingPageVariant;
}

export function CheckoutNudgeSelector({
	nudgeSettings,
	currentProduct,
	currentRatePlan,
	supportRegionId,
	landingPageSettings,
}: CheckoutNudgeSelectorProps) {
	const { nudge, promoCodes } = nudgeSettings.variant;
	if (!nudge) {
		// No nudge configured for this variant
		return null;
	} else if (
		nudgeSettings.fromProduct.product === currentProduct &&
		(nudgeSettings.fromProduct.ratePlan === undefined ||
			nudgeSettings.fromProduct.ratePlan === currentRatePlan)
	) {
		// Show the nudge
		const { nudgeToProduct } = nudge;
		const { currencyKey, countryGroupId } =
			getSupportRegionIdConfig(supportRegionId);
		// If nudgeToProduct doesn't define a ratePlan then attempt to use whatever the current selected ratePlan is
		const ratePlan = nudgeToProduct.ratePlan ?? currentRatePlan;
		const amount =
			productCatalog[nudgeToProduct.product]?.ratePlans[ratePlan]?.pricing[
				currencyKey
			];

		let promotion: Promotion | undefined;
		if (promoCodes && promoCodes.length > 0) {
			const countryId = Country.detect();
			const productKey = nudgeToProduct.product;

			if (isValidProductPriceKey(productKey)) {
				const productPrices = allProductPrices[productKey];
				const billingPeriod = ratePlanToBillingPeriod[ratePlan];
				if (productPrices && billingPeriod) {
					try {
						const productPrice = getProductPrice(
							productPrices,
							countryId,
							billingPeriod,
						);
						promotion = productPrice.promotions?.find((promo: Promotion) =>
							promoCodes.includes(promo.promoCode),
						);
					} catch (error) {
						// If getProductPrice throws, continue with the original amount
						console.warn('Failed to get product price for promotion:', error);
					}
				}
			}
		}

		if (amount) {
			const checkListData =
				getBenefitsChecklistFromLandingPageTool(
					nudgeToProduct.product,
					landingPageSettings,
					countryGroupId,
				) ?? [];
			const props = {
				supportRegionId,
				product: nudgeToProduct.product,
				ratePlan,
				amount,
				promotion,
				heading: nudge.nudgeCopy.heading,
				body: nudge.nudgeCopy.body,
				benefits: nudge.benefits
					? {
							checkListData: checkListData.slice(0, 2),
							label: nudge.benefits.label,
					  }
					: undefined,
			};
			return <CheckoutNudge {...props} />;
		}
	} else if (
		new URLSearchParams(window.location.search).get('fromNudge') &&
		nudge.nudgeToProduct.product === currentProduct &&
		(nudge.nudgeToProduct.ratePlan === undefined ||
			nudge.nudgeToProduct.ratePlan === currentRatePlan)
	) {
		// Show the thankyou
		const { heading, body } = nudge.thankyouCopy;
		return <CheckoutNudgeThankYou heading={heading} body={body} />;
	}

	// Nothing to show
	return null;
}
