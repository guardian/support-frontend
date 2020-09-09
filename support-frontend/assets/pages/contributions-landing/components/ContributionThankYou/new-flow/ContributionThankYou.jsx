// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from, between } from '@guardian/src-foundations/mq';
import { LinkButton } from '@guardian/src-button';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouContinueToAccount from './ContributionThankYouContinueToAccount';
import ContributionThankYouCompleteRegistration from './ContributionThankYouCompleteRegistration';
import ContributionThankYouHearFromOurNewsroom from './ContributionThankYouHearFromOurNewsroom';
import ContributionThankYouSetSupportReminder from './ContributionThankYouSetSupportReminder';
import ContributionThankYouSendYourThoughts from './ContributionThankYouSendYourThoughts';
import ContributionThankYouShareYourSupport from './ContributionThankYouShareYourSupport';

const container = css`
  background: white;
  padding: 0 ${space[3]}px;
  margin: 0 auto;

  ${from.tablet} {
    background: none;
    max-width: 740px;
  }

  ${from.desktop} {
    max-width: 980px;
  }

  ${from.wide} {
    max-width: 1300px;
  }
`;

const headerContainer = css`
  ${from.desktop} {
    width: calc(50% - ${space[3]}px);
  }
`;

const columnsContainer = css`
  display: flex;
  flex-direction: column;

  ${between.tablet.and.desktop} {
    & > * + * {
      margin-top: ${space[6]}px;
    }
  }

  ${from.desktop} {
    flex-direction: row;

    & > * + * {
      margin-left: ${space[6]}px;
    }
  }
`;

const columnContainer = css`
  ${from.tablet} {
    & > * + * {
      margin-top: ${space[6]}px;
    }
  }
  ${from.desktop} {
    width: calc(50% - ${space[3]}px);
  }
`;

const buttonContainer = css`
  padding-top: ${space[6]}px;
  padding-bottom: ${space[6]}px;
`;

type ContributionThankYouProps = {|
  csrf: Csrf,
  email: string,
  subscribeToNewsLetter: (email: string, csrf: Csrf) => void,
|};

const mapStateToProps = state => ({
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    subscribeToNewsLetter: (
      email: string,
      csrf: Csrf,
    ) => {
      sendMarketingPreferencesToIdentity(
        true,
        email,
        dispatch,
        csrf,
        'MARKETING_CONSENT',
      );
    },
  };
}


const ContributionThankYou = ({ csrf, email, subscribeToNewsLetter }: ContributionThankYouProps) => (
  <div css={container}>
    <div css={headerContainer}>
      <ContributionThankYouHeader showDirectDebitMessage />
    </div>

    <div css={columnsContainer}>
      <div css={columnContainer}>
        <ContributionThankYouContinueToAccount email={email} csrf={csrf} />
        <ContributionThankYouCompleteRegistration email={email} csrf={csrf} />
        <ContributionThankYouHearFromOurNewsroom subscribeToNewsLetter={() => subscribeToNewsLetter(email, csrf)} />
      </div>
      <div css={columnContainer}>
        <ContributionThankYouSetSupportReminder email={email} />
        <ContributionThankYouSendYourThoughts />
        <ContributionThankYouShareYourSupport />
      </div>
    </div>

    <div css={buttonContainer}>
      <LinkButton priority="tertiary">Return to the Guardian</LinkButton>
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(ContributionThankYou);
