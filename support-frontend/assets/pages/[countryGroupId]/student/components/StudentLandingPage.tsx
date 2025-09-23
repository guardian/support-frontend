import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import {
	Canada,
	GBPCountries,
	SupportRegionId,
	UnitedStates,
} from '@modules/internationalisation/countryGroup';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import { PageScaffold } from 'components/page/pageScaffold';
import { getSupportRegionIdConfig } from '../../../supportRegionConfig';
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
};

export function StudentLandingPage({
	supportRegionId,
	header,
	brandAwareness,
}: StudentLandingPageProps) {
	const faqItems = getStudentFAQs(supportRegionId);
	const tsAndCsItem = getStudentTsAndCs(supportRegionId);

	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);
	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [GBPCountries, UnitedStates, Canada],
		selectedCountryGroup: countryGroupId,
		subPath: '/student',
	};
	const showCountrySwitcher =
		supportRegionId !== SupportRegionId.AU &&
		countrySwitcherProps.countryGroupIds.length > 1;

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
