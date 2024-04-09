import { css } from '@emotion/react';
import { cmp } from '@guardian/consent-management-platform';
import {
	from,
	headline,
	palette,
	space,
	textSans,
} from '@guardian/source-foundations';
import { Container } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
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
import type { TsAndCsProps } from '../components/threeTierTsAndCs';
import { ThreeTierTsAndCs, ToteTsAndCs } from '../components/threeTierTsAndCs';
import type { TierPlans } from '../setup/threeTierConfig';
import {
	tierCards as tierCardsNoTote,
	tierCardsTote,
} from '../setup/threeTierConfig';

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
	contributionType: 'MONTHLY' | 'ANNUAL',
	cardPriceDiscount?: number,
): boolean => {
	const urlParams = new URLSearchParams(window.location.search);
	const urlSelectedAmount = urlParams.get('selected-amount');
	const hasUrlSelectedAmount = !isNaN(Number(urlSelectedAmount));
	if (!hasUrlSelectedAmount) {
		return false;
	}
	return (
		(contributionType in paymentFrequencyMap &&
			Number(urlSelectedAmount) === cardPrice) ||
		Number(urlSelectedAmount) === cardPriceDiscount
	);
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

	const tierCards = abParticipations.additionalBenefits
		? tierCardsTote
		: tierCardsNoTote;

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

	const promotion = useContributionsSelector((state) =>
		getPromotion(
			state.page.checkoutForm.product.productPrices,
			countryId,
			billingPeriod,
		),
	);

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

	const handleButtonCtaClick = (
		price: number,
		cardTier: 1 | 2 | 3,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => {
		dispatch(
			setSelectedAmount({
				contributionType,
				amount: `${price}`,
			}),
		);
		navigateWithPageView(
			navigate,
			generateTierCheckoutLink(cardTier, promotion),
			abParticipations,
		);
		sendEventContributionCartValue(
			price.toString(),
			contributionType,
			contributionCurrency,
		);
	};

	const handleLinkCtaClick = (
		price: number,
		contributionType: ContributionType,
		contributionCurrency: IsoCurrency,
	) => {
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

	const getCardContentBaseObject = (
		cardTier: 1 | 2 | 3,
		contributionTypeKeyOverride?: 'annual' | 'monthly',
	) => {
		let tierPlanCountryCharges =
			tierCards[`tier${cardTier}`].plans[
				contributionTypeKeyOverride ?? tierPlanPeriod
			].charges[countryGroupId];

		if (cardTier === 1) {
			tierPlanCountryCharges = {
				...tierPlanCountryCharges,
				price: recurringAmount,
			};
		}

		if (cardTier === 2 && promotion) {
			tierPlanCountryCharges = {
				...tierPlanCountryCharges,
				promoCode: promotion.promoCode,
				discount: promotion.discount
					? {
							percentage: promotion.discount.amount,
							price: promotion.discountedPrice ?? tierPlanCountryCharges.price,
							duration: {
								value: promotion.numberOfDiscountedPeriods ?? 0,
								period: contributionType,
							},
					  }
					: undefined,
			};
		}

		return {
			title: tierCards[`tier${cardTier}`].title,
			benefits: tierCards[`tier${cardTier}`].benefits,
			isRecommended: !!tierCards[`tier${cardTier}`].isRecommended,
			isUserSelected: isCardUserSelected(
				tierPlanCountryCharges.price,
				contributionType,
				tierPlanCountryCharges.discount?.price,
			),
			planCost: tierPlanCountryCharges,
		};
	};

	const getTsAndCsBaseObject = (
		cardTier: 1 | 2 | 3,
		contributionTypeKeyOverride?: 'annual' | 'monthly',
	): TsAndCsProps => {
		const cardContent = getCardContentBaseObject(
			cardTier,
			contributionTypeKeyOverride,
		);
		return {
			title: cardContent.title,
			planCost: cardContent.planCost,
		};
	};

	const { amounts } = useContributionsSelector((state) => state.common);
	const monthlyRecurringAmount = amounts.amountsCardData.MONTHLY.amounts[0];
	const annualRecurringAmount = amounts.amountsCardData.ANNUAL.amounts[0];
	const recurringAmount =
		contributionType === 'MONTHLY'
			? monthlyRecurringAmount
			: annualRecurringAmount;

	const generateTierCheckoutLink = (cardTier: 1 | 2 | 3, promo?: Promotion) => {
		const tierPlanCountryCharges =
			tierCards[`tier${cardTier}`].plans[tierPlanPeriod].charges[
				countryGroupId
			];

		const promoCode =
			cardTier !== 1
				? promo?.promoCode ?? tierPlanCountryCharges.promoCode
				: undefined;

		const url = cardTier === 3 ? `/subscribe/weekly/checkout?` : `checkout?`;
		const urlParams = new URLSearchParams();
		if (promoCode) {
			urlParams.set('promoCode', promoCode);
		}

		if (cardTier === 3) {
			urlParams.set('threeTierCreateSupporterPlusSubscription', 'true');
			urlParams.set('period', paymentFrequencyMap[contributionType]);
		} else {
			urlParams.set('selected-amount', tierPlanCountryCharges.price.toString());
			urlParams.set('selected-contribution-type', tierPlanPeriod);
		}

		return `${url}${urlParams.toString()}${window.location.hash}`;
	};

	const generateOneOffCheckoutLink = () => {
		const urlParams = new URLSearchParams();
		urlParams.set('selected-contribution-type', 'one_off');

		return `checkout?${urlParams.toString()}${window.location.hash}`;
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
						cardsContent={[
							{
								...getCardContentBaseObject(1),
							},
							{
								...getCardContentBaseObject(2),
							},
							{
								...getCardContentBaseObject(3),
								externalBtnLink: generateTierCheckoutLink(3),
							},
						]}
						currencyId={currencyId}
						paymentFrequency={contributionType}
						buttonCtaClickHandler={handleButtonCtaClick}
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
							To learn more about other ways to support the Guardian, including
							checks and tax-exempt options, please visit our{' '}
							<a href="https://manage.theguardian.com/help-centre/article/contribute-another-way?INTCMP=gdnwb_copts_support_contributions_referral">
								help page
							</a>{' '}
							on this topic.
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
							...getTsAndCsBaseObject(1),
						},
						{
							...getTsAndCsBaseObject(2),
						},
						{
							...getTsAndCsBaseObject(3),
						},
					]}
					currency={currencies[currencyId].glyph}
				></ThreeTierTsAndCs>
				{!!abParticipations.additionalBenefits && (
					<ToteTsAndCs
						currency={currencies[currencyId].glyph}
						toteCostMonthly={
							getCardContentBaseObject(2, 'monthly').planCost.price
						}
						toteCostAnnual={
							getCardContentBaseObject(2, 'annual').planCost.price
						}
					></ToteTsAndCs>
				)}
			</Container>
		</PageScaffold>
	);
}
