import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { type GeoId } from 'pages/geoIdConfig';
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
	return (
		<PageScaffold
			header={<Header />}
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
