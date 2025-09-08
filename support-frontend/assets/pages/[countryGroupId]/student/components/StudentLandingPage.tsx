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
import { Container } from 'components/layout/container';
import { PageScaffold } from 'components/page/pageScaffold';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { AccordionFAQ } from '../../components/accordionFAQ';
import { getStudentFAQs } from '../helpers/studentFAQs';
import { getStudentTsAndCs } from '../helpers/studentTsAndCsCopy';
import {
	brandAwarenessContainer,
	brandAwarenessSection,
} from './StudentLandingPageStyles';
import { StudentTsAndCs } from './studentTsAndCs';

type StudentLandingPageProps = {
	geoId: GeoId;
	header: JSX.Element;
	brandAwareness?: JSX.Element;
};

export function StudentLandingPage({
	geoId,
	header,
	brandAwareness,
}: StudentLandingPageProps) {
	const faqItems = getStudentFAQs(geoId);
	const tsAndCsItem = getStudentTsAndCs(geoId);

	const { countryGroupId } = getGeoIdConfig(geoId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries, UnitedStates, Canada],
		selectedCountryGroup: countryGroupId,
		subPath: '/student',
	};
	const showCountrySwitcher =
		geoId !== 'au' && countrySwitcherProps.countryGroupIds.length > 1;

	return (
		<PageScaffold
			header={
				<Header>
					{showCountrySwitcher && (
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
			{header}
			{brandAwareness && (
				<Container
					sideBorders
					borderColor="rgba(170, 170, 180, 0.5)"
					cssOverrides={brandAwarenessSection}
				>
					<div css={brandAwarenessContainer}>{brandAwareness}</div>
				</Container>
			)}
			{faqItems && <AccordionFAQ faqItems={faqItems} />}
			{tsAndCsItem && <StudentTsAndCs tsAndCsItem={tsAndCsItem} />}
		</PageScaffold>
	);
}
