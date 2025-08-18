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
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
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
import { Country } from 'helpers/internationalisation/classes/country';
import { currencies } from 'helpers/internationalisation/currency';
import { productCatalog } from 'helpers/productCatalog';
import { contributionTypeToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import { getSanitisedHtml } from '../../../helpers/utilities/utilities';
import Countdown from '../components/countdown';
import { LandingPageBanners } from '../components/landingPageBanners';
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
		padding: ${space[5]}px 72px;
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

type ThreeTierLandingProps = {
	geoId: GeoId;
	settings: LandingPageVariant;
	abParticipations: Participations;
};
export function ThreeTierLanding({
	geoId,
	settings,
	abParticipations,
}: ThreeTierLandingProps): JSX.Element {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const urlSearchParamsProduct = urlSearchParams.get('product');
	const urlSearchParamsRatePlan = urlSearchParams.get('ratePlan');
	const urlSearchParamsOneTime = urlSearchParams.has('oneTime');
	const urlSearchParamsPromoCode = urlSearchParams.get('promoCode');

	const { currencyKey: currencyId, countryGroupId } = getGeoIdConfig(geoId);
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

	const enableSingleContributionsTab =
		campaignSettings?.enableSingleContributions ??
		urlSearchParams.has('enableOneTime');

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

	const selectedContributionRatePlan =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';

	// We use the RRCP amounts tool for the one-off amounts only
	const { selectedAmountsVariant: amounts } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		window.guardian.settings,
	);

	/**
	 * Tier 1: Contributions
	 * We use the product catalog for the recurring Contribution tier amount
	 */
	const monthlyRecurringAmount = productCatalog.Contribution?.ratePlans.Monthly
		?.pricing[currencyId] as number;
	const annualRecurringAmount = productCatalog.Contribution?.ratePlans.Annual
		?.pricing[currencyId] as number;

	const recurringAmount =
		contributionType === 'MONTHLY'
			? monthlyRecurringAmount
			: annualRecurringAmount;

	const tier1UrlParams = new URLSearchParams({
		product: 'Contribution',
		ratePlan: selectedContributionRatePlan,
		contribution: recurringAmount.toString(),
	});
	const tier1Link = `checkout?${tier1UrlParams.toString()}`;

	const tier1Card: CardContent = {
		product: 'Contribution',
		price: recurringAmount,
		link: tier1Link,
		isUserSelected:
			urlSearchParamsProduct === 'Contribution' ||
			isCardUserSelected(recurringAmount),
		...settings.products.Contribution,
	};

	/** Tier 2: SupporterPlus */
	const supporterPlusRatePlan =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';
	const tier2Pricing = productCatalog.SupporterPlus?.ratePlans[
		supporterPlusRatePlan
	]?.pricing[currencyId] as number;

	const tier2UrlParams = new URLSearchParams({
		product: 'SupporterPlus',
		ratePlan: supporterPlusRatePlan,
	});

	const tier2Promotion = getPromotion(
		window.guardian.allProductPrices.SupporterPlus,
		countryId,
		billingPeriod,
	);
	if (tier2Promotion) {
		tier2UrlParams.set('promoCode', tier2Promotion.promoCode);
	}
	const tier2Url = `checkout?${tier2UrlParams.toString()}`;
	const tier2Card: CardContent = {
		product: 'SupporterPlus',
		price: tier2Pricing,
		link: tier2Url,
		/** The promotion from the querystring is for the SupporterPlus product only */
		promotion: tier2Promotion,
		isUserSelected:
			urlSearchParamsProduct === 'SupporterPlus' ||
			isCardUserSelected(tier2Pricing, tier2Promotion?.discount?.amount),
		...settings.products.SupporterPlus,
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
	const getTier3RatePlan = () => {
		const ratePlanKey =
			countryGroupId === 'International'
				? contributionType === 'ANNUAL'
					? 'RestOfWorldAnnual'
					: 'RestOfWorldMonthly'
				: contributionType === 'ANNUAL'
				? 'DomesticAnnual'
				: 'DomesticMonthly';

		return abParticipations.newspaperArchiveBenefit === undefined
			? ratePlanKey
			: `${ratePlanKey}V2`;
	};

	const tier3RatePlan = getTier3RatePlan();
	const tier3Pricing = productCatalog.TierThree?.ratePlans[tier3RatePlan]
		?.pricing[currencyId] as number;

	const tier3UrlParams = new URLSearchParams({
		product: 'TierThree',
		ratePlan: tier3RatePlan,
	});
	const tier3Promotion = getPromotion(
		window.guardian.allProductPrices.TierThree,
		countryId,
		billingPeriod,
		countryGroupId === 'International' ? 'RestOfWorld' : 'Domestic',

		abParticipations.newspaperArchiveBenefit === undefined
			? 'NoProductOptions'
			: 'NewspaperArchive',
	);
	if (tier3Promotion) {
		tier3UrlParams.set('promoCode', tier3Promotion.promoCode);
	}
	const tier3Card: CardContent = {
		product: 'TierThree',
		price: tier3Pricing,
		link: `checkout?${tier3UrlParams.toString()}`,
		promotion: tier3Promotion,
		isUserSelected:
			urlSearchParamsProduct === 'TierThree' ||
			isCardUserSelected(tier3Pricing, tier3Promotion?.discount?.amount),
		...settings.products.TierThree,
	};

	const showNewspaperArchiveBanner =
		abParticipations.newspaperArchiveBenefit === 'v2';

	const sanitisedHeading = getSanitisedHtml(settings.copy.heading);
	const sanitisedSubheading = getSanitisedHtml(settings.copy.subheading);

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
							currency={currencies[currencyId].glyph}
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
						/>
					)}

					{headingOverride && (
						<h1 css={heading}>
							<span
								dangerouslySetInnerHTML={{
									__html: getSanitisedHtml(headingOverride),
								}}
							/>
						</h1>
					)}
					{!headingOverride && (
						<h1 css={heading}>
							<span dangerouslySetInnerHTML={{ __html: sanitisedHeading }} />
						</h1>
					)}
					<p
						css={standFirst}
						dangerouslySetInnerHTML={{ __html: sanitisedSubheading }}
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
							currencyGlyph={currencies[currencyId].glyph}
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
					{showNewspaperArchiveBanner && <LandingPageBanners />}
				</div>
			</Container>
			{!enableSingleContributionsTab && (
				<Container
					sideBorders
					borderColor="rgba(170, 170, 180, 0.5)"
					cssOverrides={lightContainer}
				>
					<SupportOnce
						currency={currencies[currencyId].glyph}
						countryGroupId={countryGroupId}
					/>
				</Container>
			)}
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={lightContainer}
			>
				<StudentOffer
					currency={currencies[currencyId].glyph}
					countryGroupId={countryGroupId}
				/>
			</Container>
		</PageScaffold>
	);
}
