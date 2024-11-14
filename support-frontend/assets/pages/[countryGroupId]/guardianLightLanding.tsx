import { Box } from 'components/checkoutBox/checkoutBox';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { CheckoutLayout } from './components/checkoutLayout';

type GuardianLightLandingProps = {
	geoId: GeoId;
};

export function GuardianLightLanding({
	geoId,
}: GuardianLightLandingProps): JSX.Element {
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);
	return (
		<CheckoutLayout>
			<Box>
				<div>
					GuardianLightLanding ${currencyKey} ${countryGroupId}
				</div>
			</Box>
		</CheckoutLayout>
	);
}
