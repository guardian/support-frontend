import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { LandingPageLayout } from '../components/landingPageLayout';
import { AccordianComponent } from './components/accordianComponent';
import { HeaderCards } from './components/headerCards';
import { PosterComponent } from './components/posterComponent';

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
			<HeaderCards geoId={geoId} />
			<PosterComponent />
			<AccordianComponent />
		</LandingPageLayout>
	);
}
