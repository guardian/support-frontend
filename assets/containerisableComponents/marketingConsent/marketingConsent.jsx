// @flow

// ----- Imports ----- //

import * as React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import CheckboxInput from 'components/checkboxInput/checkboxInput';
import ErrorMessage from 'components/errorMessage/errorMessage';
import DotcomCta from 'components/dotcomCta/dotcomCta';
import PageSection from 'components/pageSection/pageSection';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';


// ----- Types ----- //

type PropTypes = {
  consentApiError: boolean,
  confirmOptIn: ?boolean,
  onClick: (marketingPreferencesOptIn: boolean, email?: string, csfr: CsrfState) => void,
  marketingPreferencesOptIn: boolean,
  marketingPreferenceUpdate: (preference: boolean) => void,
  email?: ?string,
  csrf: CsrfState,
};

// ----- Component ----- //

const MarketingConsent = (props: PropTypes): React.Node => {
  let content = null;
  if (!props.email) {
    return content;
  }

  if (props.confirmOptIn === null) {
    content = (
      <PageSection
        modifierClass="marketing-consent"
        heading="Stay in touch"
      >
        <CheckboxInput
          id="gnm-marketing-preference"
          checked={props.marketingPreferencesOptIn || false}
          onChange={props.marketingPreferenceUpdate}
          labelTitle="Subscriptions, membership and supporting The&nbsp;Guardian"
          labelCopy="Get related news and offers - whether you are a subscriber, member, supporter or would like to become one."
        />
        <ErrorMessage
          showError={props.consentApiError}
          message="Error confirming selection. Please try again later"
        />
        <CtaLink
          onClick={
            () => props.onClick(props.marketingPreferencesOptIn, props.email, props.csrf)
          }
          ctaId="Next"
          text="Next"
          accessibilityHint="Go to the guardian dot com front page"
        />
      </PageSection>);
  } else {
    const message = props.confirmOptIn ? 'We\'ll be in touch. Check your inbox for a confirmation link.' : 'Your preference has been recorded.';
    content = (
      <div className="component-marketing-consent__confirmation-message">
        <PageSection
          modifierClass="marketing-consent"
          heading="Stay in touch"
        >
          {message}
        </PageSection>
        <DotcomCta />
      </div>
    );
  }

  return content;
};

export default MarketingConsent;
