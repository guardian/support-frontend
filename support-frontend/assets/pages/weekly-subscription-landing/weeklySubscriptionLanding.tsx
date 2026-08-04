import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { CountryCode } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import {
	Domestic,
	type PrintFulfilmentOptions,
	RestOfWorld,
} from '@modules/product/fulfilmentOptions';
import { ClientSideErrorHandler } from 'components/ClientSideError';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Block from 'components/page/block';
import { PageScaffold } from 'components/page/pageScaffold';
import { PromoTermsProvider } from 'contexts/PromoTermsContext';
import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { Country } from 'helpers/internationalisation/classes/country';
import {
	getAbParticipations,
	setUpTrackingAndConsents,
} from 'helpers/page/page';
import { type ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { getSanitisedPromoCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import getPlanData from 'pages/paper-subscription-landing/planData';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import { DetectSupportRegion } from '../../helpers/internationalisation/classes/detectSupportRegion';
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
	supportRegionId: SupportRegionId;
	orderIsAGift: boolean;
	productPrices?: ProductPrices;
	promotionCopy?: PromotionCopy;
};
export function WeeklyLandingPage({
	countryId,
	supportRegionId,
	productPrices,
	promotionCopy,
	orderIsAGift,
}: WeeklyLandingPageProps) {
	if (!productPrices) {
		return null;
	}

	const path = orderIsAGift
		? routes.guardianWeeklySubscriptionLandingGift
		: routes.guardianWeeklySubscriptionLanding;

	// ID for Selenium tests
	const pageQaId = `qa-guardian-weekly${orderIsAGift ? '-gift' : ''}`;

	const Header = headerWithCountrySwitcherContainer({
		path,
		supportRegionId,
		listOfSupportRegions: ['uk', 'au', 'ca', 'us', 'eu', 'int', 'nz'],
		trackProduct: 'GuardianWeekly',
	});
	const promotion = getSanitisedPromoCopy(promotionCopy);

	const fulfilmentOption: PrintFulfilmentOptions =
		supportRegionId === 'int' ? RestOfWorld : Domestic;
	const planData = getPlanData('NoProductOptions', fulfilmentOption);

	return (
		<PromoTermsProvider>
			<PageScaffold
				id={pageQaId}
				header={<Header />}
				footer={
					<GuardianWeeklyFooter
						productPrices={productPrices}
						orderIsAGift={!!orderIsAGift}
						country={countryId}
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
									supportRegionId={supportRegionId}
									countryId={countryId}
									productPrices={productPrices}
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
								productPrices={productPrices}
							/>
							<WeeklyBenefits planData={planData} />
							<WeeklyPriceInfo />
						</CentredContainer>
					</>
				)}
				<WeeklyAlternativeSubs
					supportRegionId={supportRegionId}
					orderIsAGift={orderIsAGift}
				/>
			</PageScaffold>
		</PromoTermsProvider>
	);
}

const weeklyLandingProps = (): WeeklyLandingPageProps => ({
	supportRegionId: DetectSupportRegion.detect(),
	countryId: Country.detect(),
	orderIsAGift: getGlobal('orderIsAGift') ?? false,
	productPrices: getProductPrices() ?? undefined,
	promotionCopy: getPromotionCopy() ?? undefined,
});

const abParticipations = getAbParticipations();
setUpTrackingAndConsents(abParticipations);

renderPage(
	<ClientSideErrorHandler>
		<WeeklyLandingPage {...weeklyLandingProps()} />
	</ClientSideErrorHandler>,
);
