// ----- Imports ----- //
import { css } from '@emotion/react';
import CentredContainer from 'components/containers/centredContainer';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import Block from 'components/page/block';
import Page from 'components/page/page';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	detect,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import 'stylesheets/skeleton/skeleton.scss';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import { WeeklyHero } from './components/hero/hero';
import WeeklyProductPrices from './components/weeklyProductPrices';
import './weeklySubscriptionLanding.scss';
import type { WeeklyLandingPropTypes } from './weeklySubscriptionLandingProps';
import { weeklyLandingProps } from './weeklySubscriptionLandingProps';
// ----- Internationalisation ----- //
const countryGroupId: CountryGroupId = detect();
const reactElementId: Record<CountryGroupId, string> = {
	GBPCountries: 'weekly-landing-page-uk',
	UnitedStates: 'weekly-landing-page-us',
	AUDCountries: 'weekly-landing-page-au',
	NZDCountries: 'weekly-landing-page-nz',
	EURCountries: 'weekly-landing-page-eu',
	Canada: 'weekly-landing-page-ca',
	International: 'weekly-landing-page-int',
};

const closeGapAfterPageTitle = css`
	margin-top: 0;
`;

// ----- Render ----- //
function WeeklyLandingPage({
	countryId,
	productPrices,
	promotionCopy,
	orderIsAGift,
	countryGroupId,
	participations,
}: WeeklyLandingPropTypes) {
	if (!productPrices) {
		return null;
	}
	const path = orderIsAGift
		? routes.guardianWeeklySubscriptionLandingGift
		: routes.guardianWeeklySubscriptionLanding;
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy, orderIsAGift);
	// ID for Selenium tests
	const pageQaId = `qa-guardian-weekly${orderIsAGift ? '-gift' : ''}`;
	const isNewProduct = participations.newProduct === 'variant';
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
		isNewProduct,
	});
	return (
		<Page
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
			<WeeklyHero
				orderIsAGift={orderIsAGift ?? false}
				countryGroupId={countryGroupId}
				promotionCopy={sanitisedPromoCopy}
				participations={participations}
			/>
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
						orderIsAGift={orderIsAGift ?? false}
						participations={participations}
					/>
				</CentredContainer>
			</FullWidthContainer>
			<FullWidthContainer theme="white">
				<CentredContainer>
					<GiftNonGiftCta
						product="Guardian Weekly"
						href={giftNonGiftLink}
						orderIsAGift={orderIsAGift ?? false}
					/>
				</CentredContainer>
			</FullWidthContainer>
		</Page>
	);
}

setUpTrackingAndConsents();
renderPage(
	<WeeklyLandingPage {...weeklyLandingProps()} />,
	reactElementId[countryGroupId],
);
