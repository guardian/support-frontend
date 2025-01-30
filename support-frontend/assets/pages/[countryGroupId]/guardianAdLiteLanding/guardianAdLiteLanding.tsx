import { css } from '@emotion/react';
import { textSans24 } from '@guardian/source/foundations';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { GBPCountries } from 'helpers/internationalisation/countryGroup';
import { isProd } from 'helpers/urls/url';
import { getUser } from 'helpers/user/user';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
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
	const urlSearchParams = new URLSearchParams(window.location.search);
	const urlSearchParamsReturn =
		urlSearchParams.get('returnAddress') ?? undefined; // no return address supplied
	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			{!isProd() ? (
				<>
					<HeaderCards
						geoId={geoId}
						returnLink={urlSearchParamsReturn}
						isSignedIn={user.isSignedIn}
					/>
					<PosterComponent />
					<AccordianComponent />
				</>
			) : (
				<div
					css={css`
						position: relative;
						${textSans24};
						color: white;
						text-align: center;
					`}
				>
					Under Construction. Viewable within Code or Dev environments only.
				</div>
			)}
		</LandingPageLayout>
	);
}
