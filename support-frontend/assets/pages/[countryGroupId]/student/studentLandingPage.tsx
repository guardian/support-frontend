import { AUDCountries } from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { AccordionFAQ } from '../components/accordionFAQ';
import { LandingPageLayout } from '../components/landingPageLayout';
import { studentFAQs } from './helpers/studentFAQs';

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
			<AccordionFAQ faqItems={studentFAQs[countryGroupId]} />
		</LandingPageLayout>
	);
}
