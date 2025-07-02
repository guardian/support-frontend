import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { PageScaffold } from 'components/page/pageScaffold';
import type { GeoId } from 'pages/geoIdConfig';
import { StudentTsAndCs } from './components/studentTsAndCs';

export function StudentLandingPage({ geoId }: { geoId: GeoId }) {
	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<FooterLinks />
				</FooterWithContents>
			}
		>
			<StudentTsAndCs geoId={geoId} />
		</PageScaffold>
	);
}
