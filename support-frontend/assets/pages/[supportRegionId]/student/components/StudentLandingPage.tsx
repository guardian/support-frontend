import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import { PageScaffold } from 'components/page/pageScaffold';
import type { Institution } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import SupportRegionSwitcher from '../../../../components/supportRegionSwitcher/supportRegionSwitcher';
import type { SupportRegionSwitcherProps } from '../../../../components/supportRegionSwitcher/supportRegionSwitcher';
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

	const countrySwitcherProps: SupportRegionSwitcherProps = {
		supportRegionIds: ['uk', 'us', 'ca'],
		selectedSupportRegion: supportRegionId,
		subPath: '/student',
	};
	const showCountrySwitcher =
		supportRegionId !== 'au' &&
		countrySwitcherProps.supportRegionIds.length > 1;

	return (
		<PageScaffold
			header={
				<Header>
					{showCountrySwitcher && (
						<CountrySwitcherContainer>
							<SupportRegionSwitcher {...countrySwitcherProps} />
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
