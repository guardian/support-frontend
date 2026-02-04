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
import headerWithCountrySwitcherContainer from 'components/headers/header/headerWithCountrySwitcher';
import { PageScaffold } from 'components/page/pageScaffold';
import { getFeatureFlags } from 'helpers/featureFlags';
import {
	getGlobal,
	getProductPrices,
	getPromotionCopy,
} from 'helpers/globalsAndSwitches/globals';
import { Country } from 'helpers/internationalisation/classes/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { routes } from 'helpers/urls/routes';
import { GuardianWeeklyFooter } from '../../components/footerCompliant/FooterWithPromoTerms';
import { WeeklyDigitalLP } from './weeklyDigitalLP';
import { WeeklyLP } from './weeklyLP';

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
			{enableWeeklyDigital ? (
				<WeeklyDigitalLP
					countryId={countryId}
					countryGroupId={countryGroupId}
					productPrices={productPrices}
					orderIsAGift={orderIsAGift}
					promotionCopy={promotionCopy}
				/>
			) : (
				<WeeklyLP
					countryId={countryId}
					countryGroupId={countryGroupId}
					productPrices={productPrices}
					orderIsAGift={orderIsAGift}
					promotionCopy={promotionCopy}
				/>
			)}
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
