// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';


// ----- Component ----- //

export default function QuestionsContact() {

  return (
    <div className="component-questions-contact">
      <PageSection
        modifierClass="questions-contact"
        heading="Questions?"
      >
        <p className="component-questions-contact__description">
          If you have any questions about contributing to the Guardian,
          please&nbsp;
          <a
            className="component-questions-contact__link"
            href="mailto:contribution.support@theguardian.com"
          >
            contact us
          </a>
        </p>
      </PageSection>
    </div>
  );

}
