// ----- Imports ----- //
import React from "react";
import PageSection from "components/pageSection/pageSection";
import { contributionsEmail } from "helpers/legal";
import type { CountryGroupId } from "helpers/internationalisation/countryGroup";
import { GBPCountries } from "helpers/internationalisation/countryGroup";
import { ContactPageLink, useDotcomContactPage } from "helpers/utilities/dotcomContactPage";
// ---- Types ----- //
type PropTypes = {
  countryGroupId: CountryGroupId;
};

// ----- Component ----- //
function QuestionsContact(props: PropTypes) {
  const contactUs = useDotcomContactPage() ? <ContactPageLink linkText="contact us" /> : <a className="component-questions-contact__link" href={contributionsEmail[props.countryGroupId]}>
      contact us
    </a>;
  return <div className="component-questions-contact">
      <PageSection modifierClass="questions-contact" heading="Questions?">
        <p className="component-questions-contact__description">
          If you have any questions about contributing to The&nbsp;Guardian,
          please&nbsp;
          {contactUs}
        </p>
      </PageSection>
    </div>;
}

// ----- Default Props ----- //
QuestionsContact.defaultProps = {
  countryGroupId: GBPCountries
}; // ----- Exports ----- //

export default QuestionsContact;