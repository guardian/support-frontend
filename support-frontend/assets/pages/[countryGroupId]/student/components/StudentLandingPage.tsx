import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { Container } from 'components/layout/container';
import { PageScaffold } from 'components/page/pageScaffold';
import type { Institution } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import { AccordionFAQ } from '../../components/accordionFAQ';
import { getStudentFAQs } from '../helpers/studentFAQs';
import { getStudentTsAndCs } from '../helpers/studentTsAndCsCopy';
import {
	brandAwarenessContainer,
	brandAwarenessSection,
} from './StudentLandingPageStyles';
import { StudentTsAndCs } from './studentTsAndCs';

type StudentLandingPageProps = {
	supportRegionId: SupportRegionId;
	header: JSX.Element;
	brandAwareness?: JSX.Element;
	institution?: Institution;
};

export function StudentLandingPage({
	supportRegionId,
	header,
	brandAwareness,
	institution,
}: StudentLandingPageProps) {
	const faqItems = getStudentFAQs(supportRegionId, institution);
	const tsAndCsItem = getStudentTsAndCs(supportRegionId, institution);
	return (
		<PageScaffold
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
