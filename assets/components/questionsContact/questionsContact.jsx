// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import { contributionsEmail } from 'helpers/legal';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ---- Types ----- //

type PropTypes = {
    countryGroupId: CountryGroupId,
};


// ----- Component ----- //

function QuestionsContact(props: PropTypes) {

  return (
    <div className="component-questions-contact">
      <PageSection
        modifierClass="questions-contact"
        heading="Questions?"
      >
        <p className="component-questions-contact__description">
          If you have any questions about contributing to The&nbsp;Guardian,
          please&nbsp;
          <a
            className="component-questions-contact__link"
            href={contributionsEmail[props.countryGroupId]}
          >
            contact us
          </a>
        </p>
      </PageSection>
    </div>
  );

}
// ----- Default Props ----- //

QuestionsContact.defaultProps = {
  countryGroupId: 'GBPCountries',
};


// ----- Exports ----- //

export default QuestionsContact;
