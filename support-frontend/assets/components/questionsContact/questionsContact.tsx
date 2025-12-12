// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, palette, space } from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { GBPCountries } from '@modules/internationalisation/countryGroup';
import PageSection from 'components/pageSection/pageSection';
import { contributionsEmail } from 'helpers/legal';
import {
	ContactPageLink,
	useDotcomContactPage,
} from 'helpers/utilities/dotcomContactPage';
// ---- Types ----- //
type PropTypes = {
	countryGroupId: CountryGroupId;
};

const pageSectionBorderTop = css`
	border-top: 1px solid ${palette.neutral[86]};
	padding-bottom: ${space[3]}px;

	${from.desktop} {
		padding-left: ${space[5]}px;
	}
`;

// ----- Component ----- //
function QuestionsContact(props: PropTypes) {
	const contactUs = useDotcomContactPage() ? (
		<ContactPageLink linkText="contact us" />
	) : (
		<a
			className="component-questions-contact__link"
			href={contributionsEmail[props.countryGroupId]}
		>
			contact us
		</a>
	);
	return (
		<div className="component-questions-contact">
			<PageSection cssOverrides={pageSectionBorderTop} heading="Questions?">
				<p className="component-questions-contact__description">
					If you have any questions about contributing to The&nbsp;Guardian,
					please&nbsp;
					{contactUs}
				</p>
			</PageSection>
		</div>
	);
}

// ----- Default Props ----- //
QuestionsContact.defaultProps = {
	countryGroupId: GBPCountries,
}; // ----- Exports ----- //

export default QuestionsContact;
