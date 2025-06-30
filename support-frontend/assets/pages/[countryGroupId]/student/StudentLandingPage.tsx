import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { AccordianComponent } from '../components/accordianComponent';
import Header from './components/Header';
import { LandingPageLayout } from './components/landingPageLayout';

export function StudentLandingPage({ geoId }: { geoId: GeoId }) {
	const { countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries],
		selectedCountryGroup: countryGroupId,
		subPath: '/student',
	};

	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			<Header geoId={geoId} />
			<AccordianComponent />
		</LandingPageLayout>
	);
}
