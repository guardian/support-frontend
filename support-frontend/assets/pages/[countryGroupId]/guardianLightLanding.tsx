import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { GuardianLightAccordian } from './components/guardianLightAccordian';
import { GuardianLightHeaderCards } from './components/guardianLightHeaderCards';
import { GuardianLightPoster } from './components/guardianLightPoster';
import { LandingPageLayout } from './components/landingPageLayout';

type GuardianLightLandingProps = {
	geoId: GeoId;
};

export function GuardianLightLanding({
	geoId,
}: GuardianLightLandingProps): JSX.Element {
	const { countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries],
		selectedCountryGroup: countryGroupId,
		subPath: '/guardian-light',
	}; // hidden initially, will display with more regions
	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			<GuardianLightHeaderCards geoId={geoId} />
			<GuardianLightPoster />
			<GuardianLightAccordian />
		</LandingPageLayout>
	);
}
