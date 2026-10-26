import { css } from '@emotion/react';
import { from, palette, space, textSans17 } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { RecurringBillingPeriod } from '@modules/product/billingPeriod';
import { useState } from 'preact/hooks';
import { BillingPeriodButtons } from 'components/billingPeriodButtons/billingPeriodButtons';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { getMultipleAccountsTestVariantParticipation } from 'helpers/abTests/multipleAccounts';
import type { PageParticipationsResultWithFallback } from 'helpers/abTests/pageParticipations';
import { countdownSwitchOn } from 'helpers/campaigns/campaigns';
import type { ContributionType } from 'helpers/contributions';
import { Country } from 'helpers/internationalisation/classes/country';
import { glyph } from 'helpers/internationalisation/currency';
import { contributionTypeToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import { getTierCardContent } from 'pages/[countryGroupId]/helpers/getTierCardContent';
import { getTierCardPromotion } from 'pages/[countryGroupId]/helpers/getTierCardPromotion';
import { getTierCardTsAndCs } from 'pages/[countryGroupId]/helpers/getTierCardTsAndCs';
import { useStudentBeansRegionValid } from 'pages/[countryGroupId]/helpers/useStudentBeansRegionValid';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	getSanitisedHtml,
	replaceDatePlaceholder,
} from '../../../helpers/utilities/utilities';
import type { TierProductKey } from '../../[countryGroupId]/helpers/getDigitalRatePlanKey';
import { getDigitalRatePlanKey } from '../../[countryGroupId]/helpers/getDigitalRatePlanKey';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import Countdown from '../components/countdown';
import { StudentOffer } from '../components/studentOffer';
import { SupportOnce } from '../components/supportOnce';
import { ThreeTierCards } from '../components/threeTierCards';
import { ThreeTierFooter } from '../components/threeTierFooter';
import type { TsAndCsProps } from '../components/threeTierTsAndCs';
import { ThreeTierLandingHeading } from './threeTierLandingHeading';
import { TickerContainer } from './tickerContainer';
import { useThreeTierUrlSelection } from './useThreeTierUrlSelection';

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

type ThreeTierLandingProps = {
	supportRegionId: SupportRegionId;
	landingPageSettings: PageParticipationsResultWithFallback<LandingPageVariant>;
};
export function ThreeTierLanding({
	supportRegionId,
	landingPageSettings,
}: ThreeTierLandingProps): JSX.Element {
	const { variant: landingPageVariant, participations } = landingPageSettings;
	const multipleAccountsVariant = getMultipleAccountsTestVariantParticipation(
		participations,
		landingPageVariant.name,
	);
	const {
		productKey: urlProductKey,
		ratePlanKey: urlSearchParamsRatePlan,
		selectedAmount: urlSelectedAmount,
		forceWeeklyPricing,
	} = useThreeTierUrlSelection();
	const { currencyKey: currencyId, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
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

	const showStudentOffer = useStudentBeansRegionValid(
		supportRegionId,
		Country.detect(),
	);

	const countdownSettings = countdownSwitchOn()
		? landingPageVariant.countdownSettings
		: undefined;
	// We override the heading when there's a live countdown
	const [headingOverride, setHeadingOverride] = useState<string | undefined>();
	const [countdownDaysLeft, setCountdownDaysLeft] = useState<
		string | undefined
	>();

	const getInitialContributionType = (): ContributionType => {
		// 1. Query Parameters take precedence
		if (urlSearchParamsRatePlan === 'Annual') {
			return 'ANNUAL';
		} else if (urlSearchParamsRatePlan === 'Monthly') {
			return 'MONTHLY';
		}

		// 2. Default Selection from Settings
		const defaultBillingPeriod =
			landingPageVariant.defaultProductSelection?.billingPeriod;

		if (defaultBillingPeriod === 'Annual') {
			return 'ANNUAL';
		}

		// 3. Fallback
		return 'MONTHLY';
	};

	const [contributionType, setContributionType] = useState<ContributionType>(
		getInitialContributionType(),
	);

	const tierPlanPeriod = contributionType.toLowerCase();
	const billingPeriod = (tierPlanPeriod[0]?.toUpperCase() +
		tierPlanPeriod.slice(1)) as RecurringBillingPeriod;

	const paymentFrequencies: ContributionType[] = ['MONTHLY', 'ANNUAL'];

	const handlePaymentFrequencyBtnClick = (buttonIndex: number) => {
		setContributionType(paymentFrequencies[buttonIndex] as ContributionType);
	};

	// Deep Discount feature switch applies red card theme and removes 'Your selection' pill copy
	const { enableDeepDiscount } = useFeatureSwitches();

	const getTierCard = (productKey: TierProductKey) => {
		const ratePlanKey = getDigitalRatePlanKey(
			supportRegionId,
			productKey,
			contributionType,
		);
		const promotion = getTierCardPromotion({
			supportRegionId,
			productKey,
			ratePlanKey,
			billingPeriod,
		});
		return getTierCardContent({
			supportRegionId,
			productKey,
			ratePlanKey,
			landingPageVariant,
			urlSelectedAmount,
			enableDeepDiscount,
			urlProductKey,
			promotion,
			multipleAccountsVariant,
		});
	};
	const tierCards = [
		getTierCard('Contribution'),
		getTierCard('SupporterPlus'),
		getTierCard('DigitalSubscription'),
	];

	const getTierCardsTsAndCs = (): TsAndCsProps[] => {
		return tierCards.map((tierCard) =>
			getTierCardTsAndCs(tierCard, contributionType),
		);
	};

	const showTaxDisclaimer = tierCards.some(
		(tierCard) =>
			tierCard.ratePlan === 'AnnualTaxExclusive' ||
			tierCard.ratePlan === 'MonthlyTaxExclusive',
	);

	const showWeeklyPrice =
		forceWeeklyPricing || landingPageVariant.name.includes('WEEKLY_PRICE');

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
				<ThreeTierFooter
					supportRegionId={supportRegionId}
					tsAndCsContent={getTierCardsTsAndCs()}
					showTaxDisclaimer={showTaxDisclaimer}
				/>
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

					<ThreeTierLandingHeading
						heading={headingOverride ?? landingPageVariant.copy.heading}
						countdownDaysLeft={countdownDaysLeft}
					/>

					<p
						css={standFirst}
						dangerouslySetInnerHTML={{
							__html: getSanitisedHtml(
								replaceDatePlaceholder(
									landingPageVariant.copy.subheading,
									countdownDaysLeft,
								),
							),
						}}
					/>

					{landingPageVariant.tickerSettings && (
						<TickerContainer
							tickerSettings={landingPageVariant.tickerSettings}
						/>
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
					<ThreeTierCards
						cardsContent={tierCards}
						currencyId={currencyId}
						billingPeriod={billingPeriod}
						showWeeklyPrice={showWeeklyPrice}
						deepDiscount={enableDeepDiscount}
					/>
				</div>
			</Container>
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={lightContainer}
			>
				<SupportOnce
					currency={glyph(currencyId)}
					countryGroupId={countryGroupId}
				/>
				{showStudentOffer && (
					<StudentOffer
						currencyKey={currencyId}
						supportRegionId={supportRegionId}
					/>
				)}
			</Container>
		</PageScaffold>
	);
}
