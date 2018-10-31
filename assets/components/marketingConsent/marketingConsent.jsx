// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import * as React from 'react';
import CtaLink from 'components/ctaLink/ctaLink';
import CheckboxInput from 'components/checkboxInput/checkboxInput';
import ErrorMessage from 'components/errorMessage/errorMessage';
import DotcomCta from 'components/dotcomCta/dotcomCta';
import PageSection from 'components/pageSection/pageSection';

import { setGnmMarketing, type Action } from 'helpers/user/userActions';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';

import { sendMarketingPreferencesToIdentity } from './helpers';

// ----- Types ----- //

type PropTypes = {|
  consentApiError: boolean,
  confirmOptIn: ?boolean,
  onClick: (boolean, ?string, CsrfState, string) => void,
  marketingPreferencesOptIn: boolean,
  marketingPreferenceUpdate: (preference: boolean) => void,
  email: string,
  csrf: CsrfState,
  context: string,
  checkboxLabelTitle: string,
  checkboxLabelCopy: string,
|};

// ----- Component ----- //

const MarketingConsent = (props: PropTypes): React.Node => {
  let content = null;
  if (!props.email) {
    return content;
  }

  if (props.confirmOptIn === null && props.email !== null && props.email !== undefined) {
    content = (
      <ChooseMarketingPreference
        marketingPreferencesOptIn={props.marketingPreferencesOptIn}
        email={props.email}
        marketingPreferenceUpdate={props.marketingPreferenceUpdate}
        consentApiError={props.consentApiError}
        onClick={props.onClick}
        csrf={props.csrf}
        context={props.context}
        checkboxLabelTitle={props.checkboxLabelTitle}
        checkboxLabelCopy={props.checkboxLabelCopy}
      />
    );
  } else {
    const message = props.confirmOptIn ? 'We\'ll be in touch. Check your inbox for a confirmation link.' : 'Your preference has been recorded.';
    content = (<MarketingConfirmationMessage message={message} />);
  }

  return content;
};

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (marketingPreferencesOptIn: boolean, email: string, csrf: CsrfState, context: string) => {
      sendMarketingPreferencesToIdentity(
        marketingPreferencesOptIn,
        email,
        dispatch,
        csrf,
        context,
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
    consentApiError: state.page.marketingConsent.error,
    confirmOptIn: state.page.marketingConsent.confirmOptIn,
    csrf: state.page.csrf,
  };
}

// ----- Auxiliary components ----- //

function ChooseMarketingPreference(props: {
    marketingPreferencesOptIn: boolean,
    email: string,
    csrf: CsrfState,
    marketingPreferenceUpdate: (preference: boolean) => void,
    consentApiError: boolean,
    onClick: (boolean, ?string, CsrfState, string) => void,
    context: string,
    checkboxLabelTitle: string,
    checkboxLabelCopy: string,
  }) {

  return (
    <PageSection
      modifierClass="marketing-consent"
      heading="Stay in touch"
    >
      <CheckboxInput
        id="gnm-marketing-preference"
        checked={props.marketingPreferencesOptIn}
        onChange={props.marketingPreferenceUpdate}
        labelTitle={props.checkboxLabelTitle}
        labelCopy={props.checkboxLabelCopy}
      />
      <ErrorMessage
        showError={props.consentApiError}
        message="Error confirming selection. Please try again later"
      />
      <CtaLink
        onClick={
          () => props.onClick(props.marketingPreferencesOptIn, props.email, props.csrf, props.context)
        }
        text="Next"
        accessibilityHint="Go to the guardian dot com front page"
        modifierClasses={['next']}
      />
    </PageSection>
  );
}


function MarketingConfirmationMessage(props: {message: string}) {
  return (
    <div className="component-marketing-consent__confirmation-message">
      <PageSection
        modifierClass="marketing-consent"
        heading="Stay in touch"
      >
        <span className="marketing-consent__final-message">{props.message}</span>
      </PageSection>
      <DotcomCta />
    </div>
  );
}


// ----- Default Props ----- //

MarketingConsent.defaultProps = {
  checkboxLabelTitle: 'Subscriptions, membership and contributions',
  checkboxLabelCopy: 'News and offers from The Guardian, The Observer and Guardian Weekly, on the ways to read and support our journalism. Already a member, subscriber or contributor? Opt in here to receive your regular emails and updates.',
};

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
