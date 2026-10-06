import { css } from '@emotion/react';
import { from, palette, space, textSans17 } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import type { CountryCode } from '@modules/internationalisation/country';
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
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { useState } from 'preact/hooks';
import { BillingPeriodButtons } from 'components/billingPeriodButtons/billingPeriodButtons';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import { countdownSwitchOn } from 'helpers/campaigns/campaigns';
import type { ContributionType } from 'helpers/contributions';
import { Country } from 'helpers/internationalisation/classes/country';
import { glyph } from 'helpers/internationalisation/currency';
import { contributionTypeToBillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { TierConfig } from 'pages/[countryGroupId]/helpers/getTierCardContent';
import { getTierCardContent } from 'pages/[countryGroupId]/helpers/getTierCardContent';
import { getTierCardPromotion } from 'pages/[countryGroupId]/helpers/getTierCardPromotion';
import { getTierPlanCost } from 'pages/[countryGroupId]/helpers/getTierPlanCost';
import { isStudentBeansRegionValid } from 'pages/[countryGroupId]/helpers/isStudentBeansRegionValid';
import type { LandingPageVariant } from '../../../helpers/globalsAndSwitches/landingPageSettings';
import {
	getSanitisedHtml,
	replaceDatePlaceholder,
} from '../../../helpers/utilities/utilities';
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
	settings: LandingPageVariant;
};
export function ThreeTierLanding({
	supportRegionId,
	settings,
}: ThreeTierLandingProps): JSX.Element {
	const { ratePlan: urlSearchParamsRatePlan, forceWeeklyPricing } =
		useThreeTierUrlSelection();
	const { currencyCode: currencyId, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	const countryId: CountryCode = Country.detect();
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

	const countdownSettings = countdownSwitchOn()
		? settings.countdownSettings
		: undefined;
	// We override the heading when there's a live countdown
	const [headingOverride, setHeadingOverride] = useState<string | undefined>();
	const [countdownDaysLeft, setCountdownDaysLeft] = useState<
		string | undefined
	>();

	const getInitialContributionType = (): ContributionType => {
		// 1. Query Parameters take precedence
		if (urlSearchParamsRatePlan === 'annual') {
			return 'ANNUAL';
		} else if (urlSearchParamsRatePlan === 'monthly') {
			return 'MONTHLY';
		}

		// 2. Default Selection from Settings
		const defaultBillingPeriod =
			settings.defaultProductSelection?.billingPeriod;

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
		tierPlanPeriod.slice(1)) as BillingPeriod;

	const paymentFrequencies: ContributionType[] = ['MONTHLY', 'ANNUAL'];

	const handlePaymentFrequencyBtnClick = (buttonIndex: number) => {
		setContributionType(paymentFrequencies[buttonIndex] as ContributionType);
	};

	// Deep Discount feature switch applies red card theme and removes 'Your selection' pill copy
	// Student Beans Europe feature switch enables the link to Student Landing Page for prescribed countries
	const { enableStudentBeansEurope, enableDeepDiscount } = useFeatureSwitches();

	const tier1RatePlanKey = getDigitalRatePlanKey(
		contributionType,
		supportRegionId,
		'Contribution',
	);
	const tier2RatePlanKey = getDigitalRatePlanKey(
		contributionType,
		supportRegionId,
		'SupporterPlus',
	);
	const tier3RatePlanKey = getDigitalRatePlanKey(
		contributionType,
		supportRegionId,
		'DigitalSubscription',
	);

	const tier1Config: TierConfig = {
		countryId,
		tierProductKey: 'Contribution',
		supportRegionId,
		tierRatePlanKey: tier1RatePlanKey,
		billingPeriod,
		settings,
	};

	const tier1Card = getTierCardContent(tier1Config);
	const tier2Card = getTierCardContent({
		...tier1Config,
		tierRatePlanKey: tier2RatePlanKey,
		tierProductKey: 'SupporterPlus',
	});
	const tier2Promotion = getTierCardPromotion(
		supportRegionId,
		countryId,
		billingPeriod,
		tier2Card,
	);
	const tier3Card = getTierCardContent({
		...tier1Config,
		tierRatePlanKey: tier3RatePlanKey,
		tierProductKey: 'DigitalSubscription',
	});
	const tier3Promotion = getTierCardPromotion(
		supportRegionId,
		countryId,
		billingPeriod,
		tier3Card,
	);

	const showWeeklyPrice =
		forceWeeklyPricing || settings.name.includes('WEEKLY_PRICE');
	const countryCode = Country.detect();

	const tsAndCsContent: TsAndCsProps[] = [
		{
			title: tier1Card.title,
			planCost: getTierPlanCost(tier1Card.price, contributionType),
		},
		{
			title: tier2Card.title,
			planCost: getTierPlanCost(
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
			planCost: getTierPlanCost(
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
	];

	const showTaxDisclaimer = [
		tier1RatePlanKey,
		tier2RatePlanKey,
		tier3RatePlanKey,
	].some(
		(ratePlanKey) =>
			ratePlanKey === 'AnnualTaxExclusive' ||
			ratePlanKey === 'MonthlyTaxExclusive',
	);

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
					tsAndCsContent={tsAndCsContent}
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
						heading={headingOverride ?? settings.copy.heading}
						countdownDaysLeft={countdownDaysLeft}
					/>

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
					<ThreeTierCards
						cardsContent={[tier1Card, tier2Card, tier3Card]}
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
			</Container>
			{isStudentBeansRegionValid(
				supportRegionId,
				countryCode,
				enableStudentBeansEurope,
			) && (
				<Container
					sideBorders
					borderColor="rgba(170, 170, 180, 0.5)"
					cssOverrides={lightContainer}
				>
					<StudentOffer
						currencyKey={currencyId}
						supportRegionId={supportRegionId}
					/>
				</Container>
			)}
		</PageScaffold>
	);
}
