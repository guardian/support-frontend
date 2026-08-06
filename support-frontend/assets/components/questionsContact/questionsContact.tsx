import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import PageSection from 'components/pageSection/pageSection';
import { contributionsEmail } from 'helpers/legal';
import {
	ContactPageLink,
	useDotcomContactPage,
} from 'helpers/utilities/dotcomContactPage';
import {
	componentQuestionsContactDescription,
	componentQuestionsContactLink,
	pageSectionBorderTop,
} from './questionsContactStyles';

type QuestionsContactProps = {
	supportRegionId?: SupportRegionId;
};

export default function QuestionsContact({
	supportRegionId,
}: QuestionsContactProps): JSX.Element {
	const contactUs = useDotcomContactPage() ? (
		<ContactPageLink linkText="contact us" />
	) : (
		<a
			css={componentQuestionsContactLink}
			href={contributionsEmail[supportRegionId ?? 'uk']}
		>
			contact us
		</a>
	);
	return (
		<>
			<PageSection cssOverrides={pageSectionBorderTop} heading="Questions?">
				<p css={componentQuestionsContactDescription}>
					If you have any questions about contributing to The&nbsp;Guardian,
					please&nbsp;
					{contactUs}
				</p>
			</PageSection>
		</>
	);
}
