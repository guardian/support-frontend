import { GBPCountries } from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { getUser } from 'helpers/user/user';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import {
	getReturnAddress,
	setReturnAddress,
} from '../checkout/helpers/sessionStorage';
import { AccordianComponent } from '../components/accordianComponent';
import Header from './components/Header';
import { LandingPageLayout } from './components/landingPageLayout';

export function StudentLandingPage({ geoId }: { geoId: GeoId }) {
	const user = getUser();
	const { countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries],
		selectedCountryGroup: countryGroupId,
		subPath: '/guardian-ad-lite',
	}; // hidden initially, will display with more regions

	/* Return Address loading order:-
	 * 1. URLSearchParams (SessionStorage write)
	 * 2. SessionStorage load
	 * 3. Default https://www.theguardian.com
	 */
	const urlSearchParams = new URLSearchParams(window.location.search);
	const urlSearchParamsReturn = urlSearchParams.get('returnAddress');
	if (urlSearchParamsReturn) {
		setReturnAddress({ link: urlSearchParamsReturn });
	}

	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			<Header
				geoId={geoId}
				returnLink={getReturnAddress()} // defaults to urlSearchParamsReturn if available
				isSignedIn={user.isSignedIn}
			/>
			<AccordianComponent />
		</LandingPageLayout>
	);
}
