// @flow

// ----- Imports ----- //

import React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import CheckboxInput from 'components/checkboxInput/checkboxInput';
import PageSection from 'components/pageSection/pageSection';

import { connect } from 'react-redux';
import ErrorMessage from 'components/errorMessage/errorMessage';
import { setGnmMarketing } from 'helpers/user/userActions';
import { sendMarketingPreferencesToIdentity } from 'helpers/consent-api';
import type { Csrf as CsrfState } from '../../../helpers/csrf/csrfReducer';

// ----- Types ----- //

type PropTypes = {
  consentApiError: boolean,
  onClick: (marketingPreferencesOptIn: boolean, email?: string, csfr: CsrfState) => void,
  marketingPreferencesOptIn: boolean,
  marketingPreferenceUpdate: (preference: boolean) => void,
  email?: string,
  csrf: CsrfState,
};

// ----- Component ----- //

function MarketingConsent(props: PropTypes) {

  if (props.email) {
    return (
      <div className="component-questions-contact">
        <PageSection
          modifierClass="questions-contact"
          heading="Stay in touch"
        >
          <div className={"component-questions-contact__description"}>
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
          </div>
        </PageSection>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: (marketingPreferencesOptIn: boolean, email: string, csfr: CsrfState) => {
      sendMarketingPreferencesToIdentity(
        marketingPreferencesOptIn,
        email,
        dispatch,
        csfr,
      );
    },
    marketingPreferenceUpdate: (preference: boolean) => {
      dispatch(setGnmMarketing(preference));
    },
  };
}

function mapStateToProps(state) {
  return {
    email: state.page.user.email,
    marketingPreferencesOptIn: state.page.user.gnmMarketing,
    consentApiError: state.page.thankYouState.consentApiError,
    csrf: state.page.csrf,
  };
}


MarketingConsent.defaultProps = {
  email: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
