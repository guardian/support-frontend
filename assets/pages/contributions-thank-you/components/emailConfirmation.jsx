// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';


// ----- Component ----- //

export default function EmailConfirmation() {

  return (
    <div className="component-email-confirmation">
      <PageSection modifierClass="email-confirmation">
        <p className="component-email-confirmation__copy">
          Look out for an email confirming your recurring payment.
        </p>
      </PageSection>
    </div>
  );

}
