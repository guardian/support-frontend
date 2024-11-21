import { Accordion, AccordionRow } from '@guardian/source/react-components';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import {
	productCatalog,
	productCatalogGuardianLight,
} from 'helpers/productCatalog';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { GuardianLightCards } from './components/guardianLightCards';
import { LandingPageLayout } from './components/landingPageLayout';

type GuardianLightLandingProps = {
	geoId: GeoId;
};

export function GuardianLightLanding({
	geoId,
}: GuardianLightLandingProps): JSX.Element {
	const contributionType = 'Monthly';
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries],
		selectedCountryGroup: countryGroupId,
		subPath: '/guardian-light',
	};

	const currency = currencies[currencyKey];
	const price =
		productCatalog.GuardianLight.ratePlans[contributionType].pricing[
			currencyKey
		];
	const formattedPrice = simpleFormatAmount(currency, price);

	const card1UrlParams = new URLSearchParams({
		product: 'GuardianLight',
		ratePlan: contributionType,
		contribution: price.toString(),
	});
	const checkoutLink = `checkout?${card1UrlParams.toString()}`;
	const card1 = {
		link: checkoutLink,
		productDescription: productCatalogGuardianLight().GuardianLight,
		ctaCopy: `Get Guardian Light for ${formattedPrice}/month`,
	};

	const returnLink = `https://www.theguardian.com/${geoId}`; // ToDo : store and use return path
	const card2 = {
		link: returnLink,
		productDescription: productCatalogGuardianLight().GuardianLightGoBack,
		ctaCopy: 'Return to privacy options',
	};

	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			<GuardianLightCards cardsContent={[card1, card2]} />
			<Accordion>
				<AccordionRow label="Collecting from multiple newsagents">
					Present your card to a newsagent each time you collect the paper. The
					newsagent will scan your card and will be reimbursed for each
					transaction automatically.
				</AccordionRow>
				<AccordionRow label="Delivery from your retailer">
					Simply give your preferred store / retailer the barcode printed on
					your subscription letter.
				</AccordionRow>
			</Accordion>
		</LandingPageLayout>
	);
}
