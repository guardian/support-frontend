import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { CountryCode } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	countryGroups,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import {
	Domestic,
	type PrintFulfilmentOptions,
	RestOfWorld,
} from '@modules/product/fulfilmentOptions';
import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import { ClientSideErrorHandler } from 'components/ClientSideError';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Block from 'components/page/block';
import { PageScaffold } from 'components/page/pageScaffold';
import { PromoTermsProvider } from 'contexts/PromoTermsContext';
import {
	getGlobal,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';
import { Country } from 'helpers/internationalisation/classes/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { internationaliseProduct } from 'helpers/productCatalog';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { getSanitisedPromoCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import { getQueryParameter } from 'helpers/urls/url';
import getPlanData from 'pages/paper-subscription-landing/planData';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import WeeklyGiftBenefits from './components/content/weeklyGiftBenefits';
import { WeeklyAlternativeSubs } from './components/weeklyAlternativeSubs';
import { WeeklyBenefits } from './components/weeklyBenefits';
import { WeeklyCards } from './components/weeklyCards';
import WeeklyDigitalHero from './components/WeeklyDigitalHero';
import { WeeklyGiftHero } from './components/weeklyGiftHero';
import WeeklyGiftProductPrices from './components/weeklyGiftProductPrices';
import { WeeklyPriceInfo } from './components/weeklyPriceInfo';

const weeklySpacing = css`
	div {
		margin-top: 0;
	}
`;

const weeklyDigitalSpacing = css`
	padding: ${space[8]}px ${space[3]}px ${space[9]}px;
	${from.desktop} {
		width: calc(100% - 32px);
		padding: ${space[8]}px 0 ${space[9]}px;
	}
	${from.leftCol} {
		width: calc(100% - 40px);
	}
	${from.wide} {
		width: calc(100% - 64px);
	}
`;

export type WeeklyLandingPageProps = {
	countryId: CountryCode;
	countryGroupId: CountryGroupId;
	orderIsAGift: boolean;
	productCatalog: WindowProductCatalog;
	promotions: PromoWithCatalogInformation[];
	promoCode?: string;
	promotionCopy?: PromotionCopy;
};
export function WeeklyLandingPage({
	countryId,
	countryGroupId,
	productCatalog,
	promotions,
	promoCode,
	promotionCopy,
	orderIsAGift,
}: WeeklyLandingPageProps) {
	const path = orderIsAGift
		? routes.guardianWeeklySubscriptionLandingGift
		: routes.guardianWeeklySubscriptionLanding;

	// ID for Selenium tests
	const pageQaId = `qa-guardian-weekly${orderIsAGift ? '-gift' : ''}`;

	const Header = headerWithCountrySwitcherContainer({
		path,
		countryGroupId,
		listOfCountryGroups: [
			GBPCountries,
			UnitedStates,
			AUDCountries,
			EURCountries,
			Canada,
			NZDCountries,
			International,
		],
		trackProduct: 'GuardianWeekly',
	});
	const promotion = getSanitisedPromoCopy(promotionCopy);

	const fulfilmentOption: PrintFulfilmentOptions =
		countryGroupId === 'International' ? RestOfWorld : Domestic;
	const planData = getPlanData('NoProductOptions', fulfilmentOption);

	return (
		<PromoTermsProvider>
			<PageScaffold
				id={pageQaId}
				header={<Header />}
				footer={
					<GuardianWeeklyFooter
						promotions={promotions}
						productKey={internationaliseProduct(
							countryGroups[countryGroupId].supportRegionId,
							'GuardianWeeklyDomestic',
						)}
						promoCode={promoCode}
						orderIsAGift={!!orderIsAGift}
					/>
				}
			>
				{orderIsAGift ? (
					<>
						<WeeklyGiftHero promotionCopy={promotion} />
						<FullWidthContainer>
							<CentredContainer cssOverrides={weeklySpacing}>
								<Block>
									<WeeklyGiftBenefits />
								</Block>
							</CentredContainer>
						</FullWidthContainer>
						<FullWidthContainer theme="dark" hasOverlap>
							<CentredContainer>
								<WeeklyGiftProductPrices
									countryGroupId={countryGroupId}
									countryId={countryId}
									productCatalog={productCatalog}
									promotions={promotions}
									promoCode={promoCode}
								/>
							</CentredContainer>
						</FullWidthContainer>
					</>
				) : (
					<>
						<WeeklyDigitalHero promotion={promotion} />
						<CentredContainer cssOverrides={weeklyDigitalSpacing}>
							<WeeklyCards
								countryId={countryId}
								countryGroupId={countryGroupId}
								productCatalog={productCatalog}
								promotions={promotions}
								promoCode={promoCode}
							/>
							<WeeklyBenefits planData={planData} />
							<WeeklyPriceInfo />
						</CentredContainer>
					</>
				)}
				<WeeklyAlternativeSubs
					countryGroupId={countryGroupId}
					orderIsAGift={orderIsAGift}
				/>
			</PageScaffold>
		</PromoTermsProvider>
	);
}

const weeklyLandingProps = (): WeeklyLandingPageProps => ({
	countryGroupId: CountryGroup.detect(),
	countryId: Country.detect(),
	orderIsAGift: getGlobal('orderIsAGift') ?? false,
	productCatalog: window.guardian.productCatalog,
	promotions: window.guardian.promotions ?? [],
	promoCode: getQueryParameter('promoCode'),
	promotionCopy: getPromotionCopy() ?? undefined,
});

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);

renderPage(
	<ClientSideErrorHandler>
		<WeeklyLandingPage {...weeklyLandingProps()} />
	</ClientSideErrorHandler>,
);
