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
import { useEffect } from 'preact/hooks';
import { useNavigate } from 'react-router-dom';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { PaymentFrequencyButtons } from 'components/paymentFrequencyButtons/paymentFrequencyButtons';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
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
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { currencies } from 'helpers/internationalisation/currency';
import {
	productCatalog,
	productCatalogDescInclFeast,
	supporterPlusWithGuardianWeeklyAnnualPromos,
	supporterPlusWithGuardianWeeklyMonthlyPromos,
} from 'helpers/productCatalog';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getPromotion } from 'helpers/productPrice/promotions';
import { resetValidation } from 'helpers/redux/checkout/checkoutActions';
import {
	setBillingPeriod,
	setProductType,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { navigateWithPageView } from 'helpers/tracking/ophan';
import { sendEventContributionCartValue } from 'helpers/tracking/quantumMetric';
import { SupportOnce } from '../components/supportOnce';
import { ThreeTierCards } from '../components/threeTierCards';
import { ThreeTierTsAndCs } from '../components/threeTierTsAndCs';
import type { TierPlans } from '../setup/threeTierConfig';

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

// The three tier checkout only supports monthly and annual contributions
const paymentFrequencies: RegularContributionType[] = ['MONTHLY', 'ANNUAL'];
const billingFrequencies: BillingPeriod[] = ['Monthly', 'Annual'];
const paymentFrequencyMap = {
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

export function ThreeTierLanding(): JSX.Element {
	const dispatch = useContributionsDispatch();
	const navigate = useNavigate();
	const { abParticipations } = useContributionsSelector(
		(state) => state.common,
	);

	const { countryGroupId, currencyId, countryId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

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

	const contributionTypeFromState =
		useContributionsSelector(getContributionType);
	const contributionType =
		contributionTypeFromState === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
	const tierPlanPeriod = contributionType.toLowerCase() as keyof TierPlans;
	const billingPeriod = (tierPlanPeriod[0].toUpperCase() +
		tierPlanPeriod.slice(1)) as BillingPeriod;

	const promotionTier2 = useContributionsSelector((state) =>
		getPromotion(
			state.page.checkoutForm.product.supporterPlusProductPrices,
			countryId,
			billingPeriod,
		),
	);
	const promotionTier3 = useContributionsSelector((state) =>
		getPromotion(
			state.page.checkoutForm.product.tierThreeProductPrices,
			countryId,
			billingPeriod,
			countryGroupId === 'International' ? 'RestOfWorld' : 'Domestic',
		),
	);
	const promotionTier3Hardcoded =
		contributionType === 'ANNUAL'
			? supporterPlusWithGuardianWeeklyAnnualPromos[countryGroupId]
			: supporterPlusWithGuardianWeeklyMonthlyPromos[countryGroupId];

	const useGenericCheckout = abParticipations.useGenericCheckout === 'variant';

	const productCatalogDescription = productCatalogDescInclFeast;

	useEffect(() => {
		dispatch(resetValidation());
		if (contributionTypeFromState === 'ONE_OFF') {
			dispatch(setProductType('MONTHLY'));
			/*
			 * Interaction on this page only works
			 * with regular contributions (monthly | annual)
			 * this resets the product type to monthly if
			 * coming from the one off contribution checkout
			 */
		}
		dispatch(setBillingPeriod(billingPeriod));
	}, []);

	const handlePaymentFrequencyBtnClick = (buttonIndex: number) => {
		dispatch(setProductType(paymentFrequencies[buttonIndex]));
		dispatch(setBillingPeriod(billingFrequencies[buttonIndex]));
	};

	const handleLinkCtaClick = (
		event: React.MouseEvent<HTMLAnchorElement>,
		link: string,
		price: number,
		cardTier: 1 | 2 | 3,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => {
		/** This is a workaround for now while we move tier 3 to a new SupporterPlus ratePlan */
		if (cardTier === 3) {
			sendEventContributionCartValue(
				price.toString(),
				contributionType,
				contributionCurrency,
			);
			/**
			 * Lower & middle tier track component click fired via redux side effects.
			 * Top tier accessed via network request to GuardianWeekly landing page
			 * therefore tracking required
			 **/
			trackComponentClick(
				`npf-contribution-amount-toggle-${countryGroupId}-${contributionType}-${price}`,
			);
		} else {
			event.preventDefault();
			dispatch(
				setSelectedAmount({
					contributionType,
					amount: price.toString(),
				}),
			);

			sendEventContributionCartValue(
				recurringAmount.toString(),
				contributionType,
				currencyId,
			);

			/**
			 * Only Testing CardTier1 wth checkout
			 */
			if (useGenericCheckout && cardTier === 1) {
				/**
				 * Generic Checkout is not defined in supporterPlusRouter
				 */
				window.location.href = link;
			} else {
				/**
				 * I am not sure why links and the react router can't both use a direct link?
				 * i.e. `link` here is `contribute/checkout` which then doubles up when using the router
				 * to `contribute/contribute/checkout` even though it is rendered as `contribute/checkout`.
				 */
				const linkWithoutContribute = link.split('/')[1];
				navigateWithPageView(navigate, linkWithoutContribute, abParticipations);
			}
			return false;
		}
	};

	const handleSupportOnceBtnClick = () => {
		dispatch(setProductType('ONE_OFF'));
		navigateWithPageView(
			navigate,
			generateOneOffCheckoutLink(),
			abParticipations,
		);
		trackComponentClick(
			`npf-contribution-amount-toggle-${countryGroupId}-ONE_OFF`,
		);
	};

	const generateOneOffCheckoutLink = () => {
		const urlParams = new URLSearchParams();
		urlParams.set('selected-contribution-type', 'one_off');

		return `checkout?${urlParams.toString()}${window.location.hash}`;
	};

	const selectedContributionType =
		contributionType === 'ANNUAL' ? 'annual' : 'monthly';
	const selectedContributionRatePlan =
		contributionType === 'ANNUAL' ? 'Annual' : 'Monthly';

	/**
	 * Tier 1: Contributions
	 * We use the amounts from RRCP to populate the Contribution tier
	 */
	const { amounts } = useContributionsSelector((state) => state.common);
	const monthlyRecurringAmount = amounts.amountsCardData.MONTHLY.amounts[0];
	const annualRecurringAmount = amounts.amountsCardData.ANNUAL.amounts[0];
	const recurringAmount =
		contributionType === 'MONTHLY'
			? monthlyRecurringAmount
			: annualRecurringAmount;
	const tier1UrlParams = new URLSearchParams({
		'selected-amount': recurringAmount.toString(),
		'selected-contribution-type': selectedContributionType,
		product: 'Contribution',
	});
	const tier1Link = `contribute/checkout?${tier1UrlParams.toString()}`;

	const tier1GenericCheckoutUrlParams = new URLSearchParams({
		product: 'Contribution',
		ratePlan: selectedContributionRatePlan,
		price: recurringAmount.toString(),
	});
	const tier1GenericCheckoutLink = `checkout?${tier1GenericCheckoutUrlParams.toString()}`;

	const tier1Card = {
		productDescription: productCatalogDescription.Contribution,
		price: recurringAmount,
		link: useGenericCheckout ? tier1GenericCheckoutLink : tier1Link,
		isUserSelected: isCardUserSelected(recurringAmount),
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
		'selected-amount': tier2Pricing.toString(),
		'selected-contribution-type': selectedContributionType,
		product: 'SupporterPlus',
	});
	if (promotionTier2) {
		tier2UrlParams.set('promoCode', promotionTier2.promoCode);
	}

	const tier2Card = {
		productDescription: productCatalogDescription.SupporterPlus,
		price: tier2Pricing,
		link: `contribute/checkout?${tier2UrlParams.toString()}`,
		/** The promotion from the querystring is for the SupporterPlus product only */
		promotion: promotionTier2,
		isRecommended: true,
		isUserSelected: isCardUserSelected(
			tier2Pricing,
			promotionTier2?.discount?.amount,
		),
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
	const tier3UseGenericCheckout =
		abParticipations.tierThreeFromApi === 'variant';

	const tier3RatePlan =
		countryGroupId === 'International'
			? contributionType === 'ANNUAL'
				? 'RestOfWorldAnnual'
				: 'RestOfWorldMonthly'
			: contributionType === 'ANNUAL'
			? 'DomesticAnnual'
			: 'DomesticMonthly';
	const tier3Pricing =
		productCatalog.TierThree.ratePlans[tier3RatePlan].pricing[currencyId];

	const tier3UrlParamsHardcoded = new URLSearchParams({
		threeTierCreateSupporterPlusSubscriptionV2: 'true',
		period: paymentFrequencyMap[contributionType],
		promoCode: promotionTier3Hardcoded.promoCode,
	});
	const tier3CardHarcoded = {
		productDescription:
			productCatalogDescription.SupporterPlusWithGuardianWeekly,
		price: tier3Pricing,
		link: `/subscribe/weekly/checkout?${tier3UrlParamsHardcoded.toString()}`,
		promotion: promotionTier3Hardcoded,
		isRecommended: false,
		isUserSelected: isCardUserSelected(
			tier3Pricing,
			promotionTier3Hardcoded.discount.amount,
		),
		ctaCopy: getThreeTierCardCtaCopy(countryGroupId),
	};

	const tier3UrlParams = new URLSearchParams({
		product: 'TierThree',
		ratePlan: tier3RatePlan,
	});
	if (promotionTier3) {
		tier3UrlParams.set('promoCode', promotionTier3.promoCode);
	}
	const tier3CardFromApi = {
		productDescription: productCatalogDescription.TierThree,
		price: tier3Pricing,
		link: `checkout?${tier3UrlParams.toString()}`,
		promotion: promotionTier3,
		isRecommended: false,
		isUserSelected: isCardUserSelected(
			tier3Pricing,
			promotionTier3?.discount?.amount,
		),
		ctaCopy: getThreeTierCardCtaCopy(countryGroupId),
	};

	const tier3Card = tier3UseGenericCheckout
		? tier3CardFromApi
		: tier3CardHarcoded;

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
					<ThreeTierCards
						cardsContent={[tier1Card, tier2Card, tier3Card]}
						currencyId={currencyId}
						countryGroupId={countryGroupId}
						paymentFrequency={contributionType}
						linkCtaClickHandler={handleLinkCtaClick}
					/>
				</div>
			</Container>
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={oneTimeContainer(countryGroupId === UnitedStates)}
			>
				<SupportOnce
					currency={currencies[currencyId].glyph}
					btnClickHandler={handleSupportOnceBtnClick}
				/>
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
