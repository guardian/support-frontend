import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import {
	Canada,
	GBPCountries,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { AccordionFAQ } from '../components/accordionFAQ';
import StudentHeader from './components/StudentHeader';
import { StudentTsAndCs } from './components/studentTsAndCs';
import { getStudentFAQs } from './helpers/studentFAQs';
import { getStudentTsAndCs } from './helpers/studentTsAndCsCopy';

export function StudentLandingPage({
	geoId,
	landingPageVariant,
}: {
	geoId: GeoId;
	landingPageVariant: LandingPageVariant;
}) {
	const faqItems = getStudentFAQs(geoId);
	const tsAndCsItem = getStudentTsAndCs(geoId);

	const { countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries, UnitedStates, Canada],
		selectedCountryGroup: countryGroupId,
		subPath: '/student',
	};
	const enableCountrySwitcher =
		geoId !== 'au' && countrySwitcherProps.countryGroupIds.length > 1;

	return (
		<PageScaffold
			header={
				<Header>
					{enableCountrySwitcher && (
						<CountrySwitcherContainer>
							<CountryGroupSwitcher {...countrySwitcherProps} />
						</CountrySwitcherContainer>
					)}
				</Header>
			}
			footer={
				<FooterWithContents>
					<FooterLinks />
				</FooterWithContents>
			}
		>
			<StudentHeader geoId={geoId} landingPageVariant={landingPageVariant} />
			{faqItems && <AccordionFAQ faqItems={faqItems} />}
			{tsAndCsItem && <StudentTsAndCs tsAndCsItem={tsAndCsItem} />}
		</PageScaffold>
	);
}
