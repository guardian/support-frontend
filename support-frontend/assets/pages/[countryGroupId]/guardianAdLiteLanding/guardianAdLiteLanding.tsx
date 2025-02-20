import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { getUser } from 'helpers/user/user';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import {
	getReturnAddress,
	setReturnAddress,
} from '../checkout/helpers/sessionStorage';
import { AccordianComponent } from './components/accordianComponent';
import { HeaderCards } from './components/headerCards';
import { LandingPageLayout } from './components/landingPageLayout';
import { PosterComponent } from './components/posterComponent';

type GuardianAdLiteLandingProps = {
	geoId: GeoId;
};

export function GuardianAdLiteLanding({
	geoId,
}: GuardianAdLiteLandingProps): JSX.Element {
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
	/* CORP_FLAG is a shortened query parameter
     appended to enable the CODE environment ConsentOrPay Banner
     assuming they are not an ad-free reader (via cookie gu_allow_reject_all) */
	const urlSearchParamsCorpFlag =
		urlSearchParams.get('CORP_FLAG') === null ? '' : '?CORP_FLAG';
	if (urlSearchParamsReturn) {
		setReturnAddress({
			link: `${urlSearchParamsReturn}${urlSearchParamsCorpFlag}`,
		});
	}
	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			<HeaderCards
				geoId={geoId}
				returnLink={getReturnAddress()} // defaults to urlSearchParamsReturn if available
				isSignedIn={user.isSignedIn}
			/>
			<PosterComponent />
			<AccordianComponent />
		</LandingPageLayout>
	);
}
