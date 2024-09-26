import { css } from '@emotion/react';
import { cmp } from '@guardian/libs';
import {
	from,
	headline,
	palette,
	space,
	textSans,
} from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { useEffect, useMemo, useState } from 'preact/hooks';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { PaymentFrequencyButtons } from 'components/paymentFrequencyButtons/paymentFrequencyButtons';
import {
	init as abTestInit,
	getAmountsTestVariant,
} from 'helpers/abTests/abtest';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import CountryHelper from 'helpers/internationalisation/classes/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import {
	productCatalogDescription as canonicalProductCatalogDescription,
	productCatalog,
	productCatalogDescriptionNewBenefits,
} from 'helpers/productCatalog';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { getCampaignSettings } from '../../../helpers/campaigns/campaigns';
import type { CountdownSetting } from '../../../helpers/campaigns/campaigns';
import Countdown from '../components/countdown';
import { NewspaperArchiveBanner } from '../components/newspaperArchiveBanner';
import { OneOffCard } from '../components/oneOffCard';
import { SupportOnce } from '../components/supportOnce';
import { ThreeTierCards } from '../components/threeTierCards';
import { ThreeTierTsAndCs } from '../components/threeTierTsAndCs';

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
			padding: 40px 10px ${space[6]}px;
		}
	}
`;

const oneTimeContainer = (withShortPaddingBottom: boolean) => css`
	display: flex;
	background-color: ${palette.neutral[97]};
	> div {
		padding: ${space[6]}px 10px ${withShortPaddingBottom ? space[6] : '72'}px;
	}
	${from.desktop} {
		> div {
			padding-bottom: ${withShortPaddingBottom ? space[9] : space[24]}px;
		}
	}
`;

const innerContentContainer = css`
	max-width: 940px;
	margin: 0 auto;
	text-align: center;
`;

const heading = css`
	text-align: left;
	color: ${palette.neutral[100]};
	margin-top: ${space[4]}px;
	${headline.xsmall({
		fontWeight: 'bold',
	})}
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
	${textSans.medium()};
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
		margin: ${space[4]}px auto ${space[6]}px;
	}
`;

const paymentFrequencyButtonsCss = css`
	margin: ${space[4]}px auto 32px;
	${from.desktop} {
		margin: ${space[6]}px auto ${space[12]}px;
	}
`;

const tabletLineBreak = css`
	${from.desktop} {
		display: none;
	}
`;

const suppportAnotherWayContainer = css`
	margin: ${space[9]}px auto 0;
	border-top: 1px solid ${palette.neutral[86]};
	padding-top: 32px;
	max-width: 940px;
	text-align: left;
	color: #606060;
	h4 {
		${textSans.medium({ fontWeight: 'bold' })};
	}
	p {
		${textSans.small()};
	}
	a {
		color: #606060;
	}
	${from.desktop} {
		text-align: center;
		padding-top: ${space[9]}px;
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
			padding: ${space[4]}px ${space[5]}px;
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

const paymentFrequencyMap = {
	ONE_OFF: 'One-time',
	MONTHLY: 'Monthly',
	ANNUAL: 'Annual',
};
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
	const promotionDurationPeriod: RegularContributionType =
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
							period: promotionDurationPeriod,
						},
				  }
				: undefined,
	};
}

const getThreeTierCardCtaCopy = (countryGroupId: CountryGroupId): string => {
	return countryGroupId === UnitedStates ? 'Subscribe' : 'Support';
};

type ThreeTierLandingProps = {
	geoId: GeoId;
};
export function ThreeTierLanding({
	geoId,
}: ThreeTierLandingProps): JSX.Element {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const urlSearchParamsProduct = urlSearchParams.get('product');
	const urlSearchParamsRatePlan = urlSearchParams.get('ratePlan');

	const { currencyKey: currencyId, countryGroupId } = getGeoIdConfig(geoId);
	const countryId = CountryHelper.detect();

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

	const abParticipations = abTestInit({ countryId, countryGroupId });

	const initialContributionType =
		urlSearchParamsRatePlan === 'Annual' ? 'ANNUAL' : 'MONTHLY';

	const [contributionType, setContributionType] = useState<ContributionType>(
		initialContributionType,
	);

	const tierPlanPeriod = contributionType.toLowerCase();
	const billingPeriod = (tierPlanPeriod[0].toUpperCase() +
		tierPlanPeriod.slice(1)) as BillingPeriod;

	/*
	 * US EOY 2024 Campaign
	 */
	const campaignSettings = getCampaignSettings(countryGroupId);
	const enableSingleContributionsTab = countryGroupId === UnitedStates;

	// Handle which countdown to show (if any).
	const [currentCampaign, setCurrentCampaign] = useState<CountdownSetting>({
		label: 'testing',
		countdownStartInMillis: Date.parse('01 Jan 1970 00:00:00 GMT'),
		countdownDeadlineInMillis: Date.parse('01 Jan 1970 00:00:00 GMT'),
	});
	const [showCountdown, setShowCountdown] = useState<boolean>(false);

	const memoizedCurrentCampaign = useMemo(() => {
		if (!campaignSettings?.countdownSettings) {
			return undefined;
		}

		const now = Date.now();
		return campaignSettings.countdownSettings.find(
			(c) =>
				c.countdownStartInMillis < now && c.countdownDeadlineInMillis > now,
		);
	}, [campaignSettings?.countdownSettings]);

	useEffect(() => {
		if (memoizedCurrentCampaign) {
			setCurrentCampaign(memoizedCurrentCampaign);
			setShowCountdown(true);
		}
	}, [memoizedCurrentCampaign]);

	/*
	 * /////////////// END US EOY 2024 Campaign
	 */

	const paymentFrequencies: ContributionType[] = enableSingleContributionsTab
		? ['ONE_OFF', 'MONTHLY', 'ANNUAL']
		: ['MONTHLY', 'ANNUAL'];

	const handlePaymentFrequencyBtnClick = (buttonIndex: number) => {
		setContributionType(paymentFrequencies[buttonIndex]);
	};

	const selectedContributionRatePlan =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';

	const productCatalogDescription = ['v1', 'v2'].includes(
		abParticipations.newspaperArchiveBenefit ?? '',
	)
		? productCatalogDescriptionNewBenefits
		: canonicalProductCatalogDescription;

	/**
	 * Tier 1: Contributions
	 * We use the amounts from RRCP to populate the Contribution tier
	 */
	const { selectedAmountsVariant: amounts } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		window.guardian.settings,
	);
	const monthlyRecurringAmount = amounts.amountsCardData.MONTHLY.amounts[0];
	const annualRecurringAmount = amounts.amountsCardData.ANNUAL.amounts[0];
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

	const tier1Card = {
		productDescription: productCatalogDescription.Contribution,
		price: recurringAmount,
		link: tier1Link,
		isUserSelected:
			urlSearchParamsProduct === 'Contribution' ||
			isCardUserSelected(recurringAmount),
		isRecommended: false,
		ctaCopy: getThreeTierCardCtaCopy(countryGroupId),
	};

	/** Tier 2: SupporterPlus */
	const supporterPlusRatePlan =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';
	const tier2Pricing =
		productCatalog.SupporterPlus.ratePlans[supporterPlusRatePlan].pricing[
			currencyId
		];

	const tier2UrlParams = new URLSearchParams({
		product: 'SupporterPlus',
		ratePlan: supporterPlusRatePlan,
	});

	const promotionTier2 = getPromotion(
		window.guardian.allProductPrices.SupporterPlus,
		countryId,
		billingPeriod,
	);
	if (promotionTier2) {
		tier2UrlParams.set('promoCode', promotionTier2.promoCode);
	}
	const tier2Url = `checkout?${tier2UrlParams.toString()}`;
	const tier2Card = {
		productDescription: productCatalogDescription.SupporterPlus,
		price: tier2Pricing,
		link: tier2Url,
		/** The promotion from the querystring is for the SupporterPlus product only */
		promotion: promotionTier2,
		isRecommended: true,
		isUserSelected:
			urlSearchParamsProduct === 'SupporterPlus' ||
			isCardUserSelected(tier2Pricing, promotionTier2?.discount?.amount),
		ctaCopy: getThreeTierCardCtaCopy(countryGroupId),
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
		const ratePlan =
			countryGroupId === 'International'
				? contributionType === 'ANNUAL'
					? 'RestOfWorldAnnual'
					: 'RestOfWorldMonthly'
				: contributionType === 'ANNUAL'
				? 'DomesticAnnual'
				: 'DomesticMonthly';

		return abParticipations.newspaperArchiveBenefit === undefined
			? ratePlan
			: `${ratePlan}V2`;
	};

	const tier3RatePlan = getTier3RatePlan();
	const tier3Pricing =
		productCatalog.TierThree.ratePlans[tier3RatePlan].pricing[currencyId];

	const tier3UrlParams = new URLSearchParams({
		product: 'TierThree',
		ratePlan: tier3RatePlan,
	});
	const promotionTier3 = getPromotion(
		window.guardian.allProductPrices.TierThree,
		countryId,
		billingPeriod,
		countryGroupId === 'International' ? 'RestOfWorld' : 'Domestic',

		abParticipations.newspaperArchiveBenefit === undefined
			? 'NoProductOptions'
			: 'NewspaperArchive',
	);
	if (promotionTier3) {
		tier3UrlParams.set('promoCode', promotionTier3.promoCode);
	}
	const tier3Card = {
		productDescription: productCatalogDescription.TierThree,
		price: tier3Pricing,
		link: `checkout?${tier3UrlParams.toString()}`,
		promotion: promotionTier3,
		isRecommended: false,
		isUserSelected:
			urlSearchParamsProduct === 'TierThree' ||
			isCardUserSelected(tier3Pricing, promotionTier3?.discount?.amount),
		ctaCopy: getThreeTierCardCtaCopy(countryGroupId),
	};

	const showNewspaperArchiveBanner =
		abParticipations.newspaperArchiveBenefit === 'v2';

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
				<FooterWithContents>
					<FooterLinks links={links}></FooterLinks>
				</FooterWithContents>
			}
		>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={recurringContainer}
			>
				<div css={innerContentContainer}>
					{showCountdown && <Countdown campaign={currentCampaign} />}
					<h1 css={heading}>
						Support fearless, <br css={tabletLineBreak} />
						independent journalism
					</h1>
					<p css={standFirst}>
						We're not owned by a billionaire or shareholders - our readers
						support us. Choose to join with one of the options below.{' '}
						<strong>Cancel anytime.</strong>
					</p>
					<PaymentFrequencyButtons
						paymentFrequencies={paymentFrequencies.map(
							(paymentFrequency, index) => ({
								paymentFrequencyLabel: paymentFrequencyMap[paymentFrequency],
								paymentFrequencyId: paymentFrequency,
								isPreSelected: paymentFrequencies[index] === contributionType,
							}),
						)}
						buttonClickHandler={handlePaymentFrequencyBtnClick}
						additionalStyles={paymentFrequencyButtonsCss}
					/>
					{contributionType === 'ONE_OFF' && (
						<OneOffCard
							amounts={amounts}
							currencyGlyph={currencies[currencyId].glyph}
							countryGroupId={countryGroupId}
							currencyId={currencyId}
						/>
					)}
					{contributionType !== 'ONE_OFF' && (
						<ThreeTierCards
							cardsContent={[tier1Card, tier2Card, tier3Card]}
							currencyId={currencyId}
							countryGroupId={countryGroupId}
							paymentFrequency={contributionType}
						/>
					)}
					{showNewspaperArchiveBanner && <NewspaperArchiveBanner />}
				</div>
			</Container>
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={oneTimeContainer(countryGroupId === UnitedStates)}
			>
				{!enableSingleContributionsTab && (
					<SupportOnce
						currency={currencies[currencyId].glyph}
						countryGroupId={countryGroupId}
					/>
				)}
				{countryGroupId === UnitedStates && (
					<div css={suppportAnotherWayContainer}>
						<h4>Support another way</h4>
						<p>
							If you are interested in contributing through a donor-advised
							fund, foundation or retirement account, or by mailing a check,
							please visit our{' '}
							<a href="https://manage.theguardian.com/help-centre/article/contribute-another-way?INTCMP=gdnwb_copts_support_contributions_referral">
								help page
							</a>{' '}
							to learn how.
						</p>
					</div>
				)}
			</Container>
			<Container
				sideBorders
				topBorder
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={disclaimerContainer}
			>
				<ThreeTierTsAndCs
					tsAndCsContent={[
						{
							title: tier1Card.productDescription.label,
							planCost: getPlanCost(tier1Card.price, contributionType),
						},
						{
							title: tier2Card.productDescription.label,
							planCost: getPlanCost(
								tier2Card.price,
								contributionType,
								promotionTier2,
							),
							starts: promotionTier2?.starts
								? new Date(promotionTier2.starts)
								: undefined,
							expires: promotionTier2?.expires
								? new Date(promotionTier2.expires)
								: undefined,
						},
						{
							title: tier3Card.productDescription.label,
							planCost: getPlanCost(
								tier3Card.price,
								contributionType,
								promotionTier3,
							),
						},
					]}
					currency={currencies[currencyId].glyph}
				></ThreeTierTsAndCs>
			</Container>
		</PageScaffold>
	);
}
