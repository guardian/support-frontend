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
import {
	getCountryGroup,
	type ProductPrices,
} from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { getSanitisedPromoCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import { WeeklyBenefits } from './components/weeklyBenefits';
import { WeeklyCards } from './components/weeklyCards';
import { WeeklyGiftStudentSubs } from './components/weeklyGiftStudentSubs';
import { WeeklyHero } from './components/weeklyHero';
import { WeeklyPriceInfo } from './components/weeklyPriceInfo';
import WeeklyProductPrices from './components/weeklyProductPrices';

const weeklyGiftPadding = css`
	background-color: white;
	section {
		padding: ${space[3]}px ${space[3]}px ${space[12]}px;
	}
	section > div {
		margin-bottom: ${space[9]}px;
	}
	${from.phablet} {
		justify-content: space-around;
	}
`;

const closeGapAfterPageTitle = css`
	margin-top: 0;
`;

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

	const { enableWeeklyDigital } = getFeatureFlags();
	const weeklyLPFooter = !enableWeeklyDigital
		? css`
				p {
					margin-top: ${space[3]}px;
				}
		  `
		: undefined;

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
	const countryGroup = getCountryGroup(countryId);
	const productPrice =
		productPrices[countryGroup.name]?.Domestic?.NoProductOptions?.Annual?.[
			countryGroup.currency
		];
	const sampleWeeklyCardsCopy = `PRICE CARDS COMPONENT Annual=>${productPrice?.currency}${productPrice?.price}`;
	return (
		<PageScaffold
			id={pageQaId}
			header={<Header />}
			footer={
				<GuardianWeeklyFooter
					productPrices={productPrices}
					orderIsAGift={!!orderIsAGift}
					country={countryId}
					cssOverrides={weeklyLPFooter}
				/>
			}
		>
			<WeeklyHero
				orderIsAGift={orderIsAGift}
				promotionCopy={sanitisedPromoCopy}
				countryGroupId={countryGroupId}
				enableWeeklyDigital={enableWeeklyDigital}
			/>
			{enableWeeklyDigital ? (
				<FullWidthContainer theme="brand">
					<CentredContainer>
						<WeeklyCards sampleCopy={sampleWeeklyCardsCopy} />
						<WeeklyBenefits sampleCopy="WEEKLY BENEFITS COMPONENT" />
						<WeeklyPriceInfo />
					</CentredContainer>
				</FullWidthContainer>
			) : (
				<>
					<FullWidthContainer>
						<CentredContainer>
							<Block cssOverrides={closeGapAfterPageTitle}>
								{orderIsAGift ? <GiftBenefits /> : <Benefits />}
							</Block>
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
				cssOverrides={weeklyGiftPadding}
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
