import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';

type GuardianLightLandingProps = {
	geoId: GeoId;
};

export function GuardianLightLanding({
	geoId,
}: GuardianLightLandingProps): JSX.Element {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	return (
		<div>
			GuardianLightLanding ${currencyKey} ${countryGroupId}
		</div>
	);
}
