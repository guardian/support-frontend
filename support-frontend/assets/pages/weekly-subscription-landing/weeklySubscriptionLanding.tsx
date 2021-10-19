// ----- Imports ----- //
import * as React from 'react';
import Page from 'components/page/page';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import WeeklyFooter from 'components/footerCompliant/WeeklyFooter';
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
import { renderPage } from 'helpers/rendering/render';
import { routes, promotionTermsUrl } from 'helpers/urls/routes';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';
import 'stylesheets/skeleton/skeleton.scss';
import { WeeklyHero } from './components/hero/hero';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';
import WeeklyProductPrices from './components/weeklyProductPrices';
import './weeklySubscriptionLanding.scss';
import {
	promoQueryParam,
	getPromotionCopy,
} from 'helpers/productPrice/promotions';
import { getQueryParameter } from 'helpers/urls/url';
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

// ----- Render ----- //
const WeeklyLandingPage = ({
	countryId,
	productPrices,
	promotionCopy,
	orderIsAGift,
}: WeeklyLandingPropTypes) => {
	const path = orderIsAGift
		? routes.guardianWeeklySubscriptionLandingGift
		: routes.guardianWeeklySubscriptionLanding;
	const giftNonGiftLink = orderIsAGift
		? routes.guardianWeeklySubscriptionLanding
		: routes.guardianWeeklySubscriptionLandingGift;
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy);
	const defaultPromo = orderIsAGift ? 'GW20GIFT1Y' : '10ANNUAL';
	const promoTermsLink = promotionTermsUrl(
		getQueryParameter(promoQueryParam) || defaultPromo,
	);
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
	return (
		<Page
			id={pageQaId}
			header={<Header />}
			footer={<WeeklyFooter centred promoTermsLink={promoTermsLink} />}
		>
			<WeeklyHero
				orderIsAGift={orderIsAGift || false}
				countryGroupId={countryGroupId}
				promotionCopy={sanitisedPromoCopy}
			/>
			<FullWidthContainer>
				<CentredContainer>
					<Block>{orderIsAGift ? <GiftBenefits /> : <Benefits />}</Block>
				</CentredContainer>
			</FullWidthContainer>
			<FullWidthContainer theme="dark" hasOverlap>
				<CentredContainer>
					<WeeklyProductPrices
						countryId={countryId}
						productPrices={productPrices}
						orderIsAGift={orderIsAGift || false}
					/>
				</CentredContainer>
			</FullWidthContainer>
			<FullWidthContainer theme="white">
				<CentredContainer>
					<GiftNonGiftCta
						product="Guardian Weekly"
						href={giftNonGiftLink}
						orderIsAGift={orderIsAGift || false}
					/>
				</CentredContainer>
			</FullWidthContainer>
		</Page>
	);
};

setUpTrackingAndConsents();
renderPage(
	<WeeklyLandingPage {...weeklyLandingProps()} />,
	reactElementId[countryGroupId],
);
