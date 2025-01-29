import { css } from '@emotion/react';
import { storage } from '@guardian/libs';
import { textSans24 } from '@guardian/source/foundations';
import { type InferInput, object, safeParse, string } from 'valibot';
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

export const ReturnAddressSchema = object({
	link: string(),
});
function setReturnAddress(link: InferInput<typeof ReturnAddressSchema>) {
	storage.session.set('returnAddress', link);
}

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
	if (urlSearchParamsReturn) {
		setReturnAddress({ link: urlSearchParamsReturn });
	}
	const sessionStorageReturnAddress = storage.session.get('returnAddress');
	const parsedOrder = safeParse(
		ReturnAddressSchema,
		sessionStorageReturnAddress,
	);
	const returnLink = parsedOrder.success
		? parsedOrder.output.link
		: 'https://www.theguardian.com'; // defaults to urlSearchParamsReturn if available
	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			{!isProd() ? (
				<>
					<HeaderCards
						geoId={geoId}
						returnLink={returnLink}
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
