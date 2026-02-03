import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import { PageScaffold } from 'components/page/pageScaffold';
import { getFeatureFlags } from 'helpers/featureFlags';
import { getPromotionCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import { WeeklyHero } from './components/weeklyHero';
import { WeeklyDigitalLP } from './weeklyDigitalLP';
import { WeeklyLP } from './weeklyLP';
import type { WeeklyLandingPropTypes } from './weeklySubscriptionLandingProps';
import { weeklyLandingProps } from './weeklySubscriptionLandingProps';

export function WeeklyLandingPage({
	countryId,
	countryGroupId,
	productPrices,
	promotionCopy,
	orderIsAGift,
}: WeeklyLandingPropTypes) {
	if (!productPrices) {
		return null;
	}

	const { enableWeeklyDigital } = getFeatureFlags();

	const path = orderIsAGift
		? routes.guardianWeeklySubscriptionLandingGift
		: routes.guardianWeeklySubscriptionLanding;
	const sanitisedPromoCopy = getPromotionCopy(promotionCopy, orderIsAGift);

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
			<WeeklyHero
				orderIsAGift={orderIsAGift}
				promotionCopy={sanitisedPromoCopy}
				countryGroupId={countryGroupId}
			/>
			{enableWeeklyDigital ? (
				<WeeklyDigitalLP
					countryId={countryId}
					countryGroupId={countryGroupId}
					productPrices={productPrices}
					orderIsAGift={orderIsAGift}
				/>
			) : (
				<WeeklyLP
					countryId={countryId}
					countryGroupId={countryGroupId}
					productPrices={productPrices}
					orderIsAGift={orderIsAGift}
				/>
			)}
		</PageScaffold>
	);
}

renderPage(<WeeklyLandingPage {...weeklyLandingProps()} />);
