import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
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
	countryGroupId?: CountryGroupId;
};

export default function QuestionsContact({
	countryGroupId,
}: QuestionsContactProps): JSX.Element {
	const contactUs = useDotcomContactPage() ? (
		<ContactPageLink linkText="contact us" />
	) : (
		<a
			css={componentQuestionsContactLink}
			href={contributionsEmail[countryGroupId ?? GBPCountries]}
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
