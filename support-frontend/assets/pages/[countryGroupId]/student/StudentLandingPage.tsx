import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { GeoId } from 'pages/geoIdConfig';
import StudentHeader from './components/StudentHeader';
import { StudentTsAndCs } from './components/studentTsAndCs';
import { getStudentTsAndCs } from './helpers/studentTsAndCsCopy';

export function StudentLandingPage({ geoId }: { geoId: GeoId }) {
	const tsAndCsItems = getStudentTsAndCs(geoId);
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
			{tsAndCsItems && <StudentTsAndCs tsAndCsItem={tsAndCsItems} />}
		</PageScaffold>
	);
}
