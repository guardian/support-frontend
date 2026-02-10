import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { IsoCountry } from '@modules/internationalisation/country';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { PrintFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Block from 'components/page/block';
import { PageScaffold } from 'components/page/pageScaffold';
import { getFeatureFlags } from 'helpers/featureFlags';
import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { Country } from 'helpers/internationalisation/classes/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { type ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { getSanitisedPromoCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import getPlanData from 'pages/paper-subscription-landing/planData';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import { WeeklyBenefits } from './components/weeklyBenefits';
import { WeeklyCards } from './components/weeklyCards';
import { WeeklyGiftStudentSubs } from './components/weeklyGiftStudentSubs';
import { WeeklyHero } from './components/weeklyHero';
import { WeeklyPriceInfo } from './components/weeklyPriceInfo';
import WeeklyProductPrices from './components/weeklyProductPrices';

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

const { enableWeeklyDigital } = getFeatureFlags();

export type WeeklyLandingPageProps = {
	countryId: IsoCountry;
	countryGroupId: CountryGroupId;
	orderIsAGift: boolean;
	productPrices?: ProductPrices;
	promotionCopy?: PromotionCopy;
};
export function WeeklyLandingPage({
	countryId,
	countryGroupId,
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
	const sanitisedPromoCopy = getSanitisedPromoCopy(promotionCopy, orderIsAGift);

	const fulfilmentOption: PrintFulfilmentOptions =
		countryGroupId == 'International' ? 'RestOfWorld' : 'Domestic';
	const planData = getPlanData('NoProductOptions', fulfilmentOption);
	return (
		<PageScaffold
			id={pageQaId}
			header={<Header />}
			footer={
				<GuardianWeeklyFooter
					productPrices={productPrices}
					orderIsAGift={!!orderIsAGift}
					country={countryId}
					enableWeeklyDigital={enableWeeklyDigital}
				/>
			}
		>
			<WeeklyHero
				isGift={orderIsAGift}
				promotionCopy={sanitisedPromoCopy}
				countryGroupId={countryGroupId}
				enableWeeklyDigital={enableWeeklyDigital}
			/>
			{enableWeeklyDigital ? (
				<FullWidthContainer theme="brand">
					<CentredContainer cssOverrides={weeklyDigitalSpacing}>
						<WeeklyCards countryId={countryId} productPrices={productPrices} />
						<WeeklyBenefits planData={planData} />
						<WeeklyPriceInfo />
					</CentredContainer>
				</FullWidthContainer>
			) : (
				<>
					<FullWidthContainer>
						<CentredContainer cssOverrides={weeklySpacing}>
							<Block>{orderIsAGift ? <GiftBenefits /> : <Benefits />}</Block>
						</CentredContainer>
					</FullWidthContainer>
					<FullWidthContainer theme="dark" hasOverlap>
						<CentredContainer>
							<WeeklyProductPrices
								countryId={countryId}
								productPrices={productPrices}
								orderIsAGift={orderIsAGift}
							/>
						</CentredContainer>
					</FullWidthContainer>
				</>
			)}
			<WeeklyGiftStudentSubs
				countryGroupId={countryGroupId}
				orderIsAGift={orderIsAGift}
				enableWeeklyDigital={enableWeeklyDigital}
			/>
		</PageScaffold>
	);
}

const weeklyLandingProps = (): WeeklyLandingPageProps => ({
	countryGroupId: CountryGroup.detect(),
	countryId: Country.detect(),
	orderIsAGift: getGlobal('orderIsAGift') ?? false,
	productPrices: getProductPrices() ?? undefined,
	promotionCopy: getPromotionCopy() ?? undefined,
});
renderPage(<WeeklyLandingPage {...weeklyLandingProps()} />);
