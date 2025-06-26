import { AUDCountries } from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { StudentHeaderCard } from './components/studentHeaderCard';
import { LandingPageLayout } from './guardianAdLiteLanding/components/landingPageLayout';

type Props = {
	geoId: GeoId;
};

export function StudentLandingPage({ geoId }: Props) {
	const { countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [AUDCountries],
		selectedCountryGroup: countryGroupId,
		subPath: '/student',
	}; // AU initially, further updates will display with more regions
	return (
		<LandingPageLayout countrySwitcherProps={countrySwitcherProps}>
			<StudentHeaderCard geoId={geoId} />
		</LandingPageLayout>
	);
}
