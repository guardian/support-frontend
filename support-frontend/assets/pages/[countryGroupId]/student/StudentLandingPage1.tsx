import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import { type GeoId, getGeoIdConfig } from 'pages/geoIdConfig';
import { AccordionFAQ } from '../components/accordionFAQ';
import StudentHeader from './components/StudentHeader';
import { getStudentFAQs } from './helpers/studentFAQs';

export function StudentLandingPage({ geoId }: { geoId: GeoId }) {
	const { countryGroupId } = getGeoIdConfig(geoId);
	const faqItems = getStudentFAQs(countryGroupId);
	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<FooterLinks />
				</FooterWithContents>
			}
		>
			<StudentHeader geoId={geoId} />
			{faqItems && <AccordionFAQ faqItems={faqItems} />}
		</PageScaffold>
	);
}
