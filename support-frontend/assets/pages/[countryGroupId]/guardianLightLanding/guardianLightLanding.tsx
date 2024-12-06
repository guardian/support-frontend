import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { isProd } from 'helpers/urls/url';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { AccordianComponent } from './components/accordianComponent';
import { HeaderCards } from './components/headerCards';
import { LandingPageLayout } from './components/landingPageLayout';
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
			{!isProd() ? (
				<>
					<HeaderCards geoId={geoId} />
					<PosterComponent />
					<AccordianComponent />
				</>
			) : (
				<>Under Construction. Viewable within Code or Dev environments.</>
			)}
		</LandingPageLayout>
	);
}
