import { css } from '@emotion/react';
import { cmp } from '@guardian/libs';
import {
	from,
	headlineBold24,
	palette,
	space,
	textSans17,
	textSansBold20,
} from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type {
	CountryGroupId,
	SupportRegionId,
} from '@modules/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { useState } from 'preact/hooks';
import { BillingPeriodButtons } from 'components/billingPeriodButtons/billingPeriodButtons';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { getAmountsTestVariant } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import {
	countdownSwitchOn,
	getCampaignSettings,
} from 'helpers/campaigns/campaigns';
import type { ContributionType } from 'helpers/contributions';
import { getFeatureFlags } from 'helpers/featureFlags';
import { Country } from 'helpers/internationalisation/classes/country';
import { glyph } from 'helpers/internationalisation/currency';
import {
	getProductDescription,
	getProductLabel,
	productCatalog,
	productCatalogDescriptionPremiumDigital,
} from 'helpers/productCatalog';
import { contributionTypeToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
import { filterProductDescriptionBenefits } from 'pages/[countryGroupId]/checkout/helpers/benefitsChecklist';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	getSanitisedHtml,
	replaceDatePlaceholder,
} from '../../../helpers/utilities/utilities';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import Countdown from '../components/countdown';
import { OneOffCard } from '../components/oneOffCard';
import { StudentOffer } from '../components/studentOffer';
import { SupportOnce } from '../components/supportOnce';
import type { CardContent } from '../components/threeTierCard';
import { ThreeTierCards } from '../components/threeTierCards';
import { ThreeTierTsAndCs } from '../components/threeTierTsAndCs';
import { TickerContainer } from './tickerContainer';

const recurringContainer = css`
	background-color: ${palette.brand[400]};
	border-bottom: 1px solid ${palette.brand[600]};
	> div {
		padding: ${space[2]}px 10px ${space[4]}px;
	}
	${from.mobileLandscape} {
		> div {
			padding: ${space[2]}px ${space[5]}px ${space[4]}px;
		}
	}
	${from.tablet} {
		border-bottom: none;
		> div {
			padding: ${space[2]}px 10px ${space[4]}px;
		}
	}
	${from.desktop} {
		> div {
			padding: 40px 10px 72px;
		}
	}
`;

const lightContainer = css`
	display: flex;
	background-color: ${palette.neutral[97]};
	> div {
		padding: ${space[5]}px;

		${from.tablet} {
			padding: ${space[5]}px 72px;
		}
	}
`;

const innerContentContainer = css`
	max-width: 940px;
	margin: 0 auto;
	text-align: center;
`;

const heading = css`
	text-wrap: balance;
	text-align: left;
	color: ${palette.neutral[100]};
	${headlineBold24}
	${from.tablet} {
		text-align: center;
	}
	${from.desktop} {
		font-size: 2.625rem;
	}
`;

const standFirst = css`
	text-align: left;
	color: ${palette.neutral[100]};
	margin: 0 0 ${space[4]}px;
	${textSans17};
	line-height: 1.35;
	strong {
		font-weight: bold;
	}
	${from.tablet} {
		text-align: center;
		width: 65%;
		margin: 0 auto;
	}
	${from.desktop} {
		margin: ${space[4]}px auto ${space[9]}px;
	}
`;

const paymentFrequencyButtonsCss = css`
	margin: ${space[4]}px auto 32px;
	${from.desktop} {
		margin: 0 auto ${space[9]}px;
	}
`;

const supportAnotherWayContainer = css`
	display: flex;
	background-color: #1e3e72;
`;

const supportAnotherWay = css`
	margin: 20px 0;
	max-width: 940px;
	text-align: left;
	color: ${palette.neutral[100]};
	h4 {
		${textSansBold20};
	}
	p {
		${textSans17};
	}
	a {
		color: ${palette.neutral[100]};
	}
`;

const disclaimerContainer = css`
	background-color: ${palette.brand[400]};
	> div {
		border-bottom: 1px solid ${palette.brand[600]};
		padding: ${space[4]}px 10px;
	}
	${from.mobileLandscape} {
		> div {
			padding: ${space[5]}px ${space[5]}px;
		}
	}
`;

const links = [
	{
		href: 'https://www.theguardian.com/info/privacy',
		text: 'Privacy policy',
		isExternal: true,
	},
	{
		text: 'Privacy settings',
		onClick: () => {
			cmp.showPrivacyManager();
		},
	},
	{
		href: 'https://www.theguardian.com/help/contact-us',
		text: 'Contact us',
		isExternal: true,
	},
	{
		href: 'https://www.theguardian.com/help',
		text: 'Help centre',
		isExternal: true,
	},
];

const isCardUserSelected = (
	cardPrice: number,
	cardPriceDiscount?: number,
): boolean => {
	const urlParams = new URLSearchParams(window.location.search);
	const urlSelectedAmount = urlParams.get('selected-amount');
	const hasUrlSelectedAmount = !isNaN(Number(urlSelectedAmount));
	if (!hasUrlSelectedAmount) {
		return false;
	}
	return (
		Number(urlSelectedAmount) === cardPrice ||
		Number(urlSelectedAmount) === cardPriceDiscount
	);
};

/**
 * @deprecated - we should be useing ProductCatalog data types.
 * TODO - remove this once TsAndCs work of ☝️ types
 */
function getPlanCost(
	pricing: number,
	contributionType: ContributionType,
	promotion?: Promotion,
) {
	const promotionDurationPeriod: ContributionType =
		contributionType === 'ANNUAL' && promotion?.discount?.durationMonths === 12
			? 'ANNUAL'
			: 'MONTHLY';

	const promotionDurationValue =
		promotionDurationPeriod === 'ANNUAL'
			? 1
			: promotion?.discount?.durationMonths;

	return {
		price: pricing,
		promoCode: promotion?.name,
		discount:
			promotion?.discount?.amount && promotion.discountedPrice
				? {
						percentage: promotion.discount.amount,
						price: promotion.discountedPrice,
						duration: {
							value: promotionDurationValue ?? 0,
							period: contributionTypeToBillingPeriod(promotionDurationPeriod),
						},
				  }
				: undefined,
	};
}

function getRatePlanKey(contributionType: ContributionType) {
	switch (contributionType) {
		case 'ANNUAL':
			return 'Annual';
		default:
			return 'Monthly';
	}
}
const getTierThreeRatePlanKey = (
	contributionType: ContributionType,
	countryGroupId: CountryGroupId,
) => {
	const ratePlanKey =
		countryGroupId === 'International'
			? contributionType === 'ANNUAL'
				? 'RestOfWorldAnnual'
				: 'RestOfWorldMonthly'
			: contributionType === 'ANNUAL'
			? 'DomesticAnnual'
			: 'DomesticMonthly';
	return ratePlanKey;
};

type ThreeTierLandingProps = {
	supportRegionId: SupportRegionId;
	settings: LandingPageVariant;
	abParticipations: Participations;
};
export function ThreeTierLanding({
	supportRegionId,
	settings,
}: ThreeTierLandingProps): JSX.Element {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const urlSearchParamsProduct = urlSearchParams.get('product');
	const urlSearchParamsRatePlan = urlSearchParams.get('ratePlan');
	const urlSearchParamsOneTime = urlSearchParams.has('oneTime');
	const urlSearchParamsPromoCode = urlSearchParams.get('promoCode');
	const { enablePremiumDigital, enableDigitalAccess } = getFeatureFlags();

	const { currencyKey: currencyId, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	const countryId = Country.detect();

	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [
			GBPCountries,
			UnitedStates,
			AUDCountries,
			EURCountries,
			NZDCountries,
			Canada,
			International,
		],
		selectedCountryGroup: countryGroupId,
		subPath: '/contribute',
	};

	const campaignSettings = getCampaignSettings(
		countryGroupId,
		urlSearchParamsPromoCode,
	);

	const countdownSettings = countdownSwitchOn()
		? settings.countdownSettings
		: undefined;
	// We override the heading when there's a live countdown
	const [headingOverride, setHeadingOverride] = useState<string | undefined>();
	const [countdownDaysLeft, setCountdownDaysLeft] = useState<
		string | undefined
	>();

	const enableSingleContributionsTab =
		campaignSettings?.enableSingleContributions ??
		urlSearchParams.has('enableOneTime');

	const enableStudentOffer = ['uk', 'us', 'ca'].includes(supportRegionId);

	const getInitialContributionType = () => {
		if (enableSingleContributionsTab && urlSearchParamsOneTime) {
			return 'ONE_OFF';
		}
		return urlSearchParamsRatePlan === 'Annual' ? 'ANNUAL' : 'MONTHLY';
	};

	const [contributionType, setContributionType] = useState<ContributionType>(
		getInitialContributionType(),
	);

	const tierPlanPeriod = contributionType.toLowerCase();
	const billingPeriod = (tierPlanPeriod[0]?.toUpperCase() +
		tierPlanPeriod.slice(1)) as BillingPeriod;

	const paymentFrequencies: ContributionType[] = enableSingleContributionsTab
		? ['ONE_OFF', 'MONTHLY', 'ANNUAL']
		: ['MONTHLY', 'ANNUAL'];

	const handlePaymentFrequencyBtnClick = (buttonIndex: number) => {
		setContributionType(paymentFrequencies[buttonIndex] as ContributionType);
	};

	// We use the RRCP amounts tool for the one-off amounts only
	const { selectedAmountsVariant: amounts } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		window.guardian.settings,
	);

	const ratePlanKey = getRatePlanKey(contributionType);

	/**
	 * Tier 1: Contributions
	 * We use the product catalog for the recurring Contribution tier amount
	 */
	const tier1Pricing = productCatalog.Contribution?.ratePlans[ratePlanKey]
		?.pricing[currencyId] as number;
	const tier1UrlParams = new URLSearchParams({
		product: 'Contribution',
		ratePlan: getRatePlanKey(contributionType),
		contribution: tier1Pricing.toString(),
	});
	const tier1Url = `checkout?${tier1UrlParams.toString()}`;
	const tier1Card: CardContent = {
		product: 'Contribution',
		price: tier1Pricing,
		link: tier1Url,
		isUserSelected:
			urlSearchParamsProduct === 'Contribution' ||
			isCardUserSelected(tier1Pricing),
		...settings.products.Contribution,
	};

	/** Tier 2: SupporterPlus */
	const tier2Pricing = productCatalog.SupporterPlus?.ratePlans[ratePlanKey]
		?.pricing[currencyId] as number;
	const tier2UrlParams = new URLSearchParams({
		product: 'SupporterPlus',
		ratePlan: ratePlanKey,
	});
	const tier2Promotion = getPromotion(
		allProductPrices.SupporterPlus,
		countryId,
		billingPeriod,
	);
	if (tier2Promotion) {
		tier2UrlParams.set('promoCode', tier2Promotion.promoCode);
	}
	if (enableDigitalAccess) {
		tier2UrlParams.set('enableDigitalAccess', 'true');
	}
	const tier2ProductDescription = {
		...settings.products.SupporterPlus,
		title: getProductLabel('SupporterPlus'),
	};

	const tier2Card: CardContent = {
		product: 'SupporterPlus',
		price: tier2Pricing,
		link: `checkout?${tier2UrlParams.toString()}`,
		/** The promotion from the querystring is for the SupporterPlus product only */
		promotion: tier2Promotion,
		isUserSelected:
			urlSearchParamsProduct === 'SupporterPlus' ||
			isCardUserSelected(tier2Pricing, tier2Promotion?.discount?.amount),
		...tier2ProductDescription,
	};

	/**
	 * Tier 3: SupporterPlus with Guardian Weekly
	 * This products promotions are hard-coded for now
	 */

	/**
	 * We do this as sending the old amount (£10) down the pipes will cause
	 * `support-workers` to fail as it calculates the contribution amount from the amount sent minus the catalog price
	 * e.g. state.amount - catalogPrice i.e. 10-12 and failes if the price is less than 0
	 *
	 * @see: https://github.com/guardian/support-frontend/blob/main/support-workers/src/main/scala/com/gu/zuora/subscriptionBuilders/SupporterPlusSubcriptionBuilder.scala#L38-L42
	 *
	 * This should avoid a race condition of us deploying the price rise before frontend is deployed.
	 *
	 * This should only exist as long as the Tier three hack is in place.
	 */
	const tier3Product = enablePremiumDigital
		? 'DigitalSubscription'
		: 'TierThree';
	const tier3RatePlanKey = enablePremiumDigital
		? ratePlanKey
		: getTierThreeRatePlanKey(contributionType, countryGroupId);
	const tier3Pricing = productCatalog[tier3Product]?.ratePlans[tier3RatePlanKey]
		?.pricing[currencyId] as number;
	const tier3UrlParams = new URLSearchParams({
		product: tier3Product,
		ratePlan: tier3RatePlanKey,
	});
	const { label: title, labelPill: titlePill } = getProductDescription(
		'DigitalSubscription',
		ratePlanKey,
	);
	const premiumDigitalProductDescription = {
		title,
		titlePill,
		benefits: filterProductDescriptionBenefits(
			productCatalogDescriptionPremiumDigital,
			countryGroupId,
		),
		cta: {
			copy: settings.products.TierThree.cta.copy,
		},
	};
	const tier3ProductDescription = enablePremiumDigital
		? premiumDigitalProductDescription
		: settings.products.TierThree;
	const tier3ProductPrice = enablePremiumDigital
		? allProductPrices.DigitalPack
		: allProductPrices.TierThree;
	const tier3Promotion = tier3ProductPrice
		? getPromotion(
				tier3ProductPrice,
				countryId,
				billingPeriod,
				countryGroupId === 'International' ? 'RestOfWorld' : 'Domestic',
				enablePremiumDigital ? 'NewspaperArchive' : 'NoProductOptions',
		  )
		: undefined;
	if (tier3Promotion) {
		tier3UrlParams.set('promoCode', tier3Promotion.promoCode);
	}
	const tier3Card: CardContent = {
		product: tier3Product,
		price: tier3Pricing,
		link: `checkout?${tier3UrlParams.toString()}`,
		promotion: tier3Promotion,
		isUserSelected:
			urlSearchParamsProduct === tier3Product ||
			isCardUserSelected(tier3Pricing, tier3Promotion?.discount?.amount),
		...tier3ProductDescription,
	};

	return (
		<PageScaffold
			header={
				<>
					<Header>
						<CountrySwitcherContainer>
							<CountryGroupSwitcher {...countrySwitcherProps} />
						</CountrySwitcherContainer>
					</Header>
				</>
			}
			footer={
				<>
					{countryGroupId === UnitedStates && (
						<Container
							sideBorders
							borderColor="rgba(170, 170, 180, 0.5)"
							cssOverrides={supportAnotherWayContainer}
						>
							<div css={supportAnotherWay}>
								<h4>Support another way</h4>
								<p>
									If you are interested in contributing through a donor-advised
									fund, foundation or retirement account, or by mailing a check,{' '}
									<br />
									please visit our{' '}
									<a href="https://manage.theguardian.com/help-centre/article/contribute-another-way?INTCMP=gdnwb_copts_support_contributions_referral">
										help page
									</a>{' '}
									to learn how.
								</p>
							</div>
						</Container>
					)}
					<Container
						sideBorders
						borderColor="rgba(170, 170, 180, 0.5)"
						cssOverrides={disclaimerContainer}
					>
						<ThreeTierTsAndCs
							tsAndCsContent={[
								{
									title: tier1Card.title,
									planCost: getPlanCost(tier1Card.price, contributionType),
								},
								{
									title: tier2Card.title,
									planCost: getPlanCost(
										tier2Card.price,
										contributionType,
										tier2Promotion,
									),
									starts: tier2Promotion?.starts
										? new Date(tier2Promotion.starts)
										: undefined,
									expires: tier2Promotion?.expires
										? new Date(tier2Promotion.expires)
										: undefined,
								},
								{
									title: tier3Card.title,
									planCost: getPlanCost(
										tier3Card.price,
										contributionType,
										tier3Promotion,
									),
									starts: tier3Promotion?.starts
										? new Date(tier3Promotion.starts)
										: undefined,
									expires: tier3Promotion?.expires
										? new Date(tier3Promotion.expires)
										: undefined,
								},
							]}
							currency={glyph(currencyId)}
						></ThreeTierTsAndCs>
					</Container>
					<FooterWithContents>
						<FooterLinks links={links}></FooterLinks>
					</FooterWithContents>
				</>
			}
		>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={recurringContainer}
			>
				<div css={innerContentContainer}>
					{countdownSettings && (
						<Countdown
							countdownSettings={countdownSettings}
							setHeadingOverride={setHeadingOverride}
							setDaysTillDeadline={setCountdownDaysLeft}
						/>
					)}

					{headingOverride && (
						<h1 css={heading}>
							<span
								dangerouslySetInnerHTML={{
									__html: getSanitisedHtml(
										replaceDatePlaceholder(headingOverride, countdownDaysLeft),
									),
								}}
							/>
						</h1>
					)}
					{!headingOverride && (
						<h1 css={heading}>
							<span
								dangerouslySetInnerHTML={{
									__html: getSanitisedHtml(
										replaceDatePlaceholder(
											settings.copy.heading,
											countdownDaysLeft,
										),
									),
								}}
							/>
						</h1>
					)}
					<p
						css={standFirst}
						dangerouslySetInnerHTML={{
							__html: getSanitisedHtml(
								replaceDatePlaceholder(
									settings.copy.subheading,
									countdownDaysLeft,
								),
							),
						}}
					/>

					{settings.tickerSettings && (
						<TickerContainer tickerSettings={settings.tickerSettings} />
					)}
					<BillingPeriodButtons
						billingPeriods={paymentFrequencies.map((paymentFrequency) =>
							contributionTypeToBillingPeriod(paymentFrequency),
						)}
						preselectedBillingPeriod={
							paymentFrequencies
								.filter((pf) => pf === contributionType)
								.map((pf) => contributionTypeToBillingPeriod(pf))[0]
						}
						buttonClickHandler={handlePaymentFrequencyBtnClick}
						additionalStyles={paymentFrequencyButtonsCss}
					/>
					{contributionType === 'ONE_OFF' && (
						<OneOffCard
							amounts={amounts}
							currencyGlyph={glyph(currencyId)}
							countryGroupId={countryGroupId}
							currencyId={currencyId}
							heading={campaignSettings?.copy.oneTimeHeading}
						/>
					)}
					{contributionType !== 'ONE_OFF' && (
						<ThreeTierCards
							cardsContent={[tier1Card, tier2Card, tier3Card]}
							currencyId={currencyId}
							billingPeriod={billingPeriod}
						/>
					)}
				</div>
			</Container>
			{!enableSingleContributionsTab && (
				<Container
					sideBorders
					borderColor="rgba(170, 170, 180, 0.5)"
					cssOverrides={lightContainer}
				>
					<SupportOnce
						currency={glyph(currencyId)}
						countryGroupId={countryGroupId}
					/>
				</Container>
			)}
			{enableStudentOffer && (
				<Container
					sideBorders
					borderColor="rgba(170, 170, 180, 0.5)"
					cssOverrides={lightContainer}
				>
					<StudentOffer
						currencyKey={currencyId}
						countryGroupId={countryGroupId}
					/>
				</Container>
			)}
		</PageScaffold>
	);
}
