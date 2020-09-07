// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Action } from 'helpers/user/userActions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
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

  ${from.desktop} {
    background: none;
    padding 0 ${space[24]}px;
  }
`;

const columnsContainer = css`
  display: flex;
  flex-direction: column;

  ${from.desktop} {
    flex-direction: row;

    & > * + * {
      margin-left: ${space[6]}px;
    }
  }
`;

const columnContainer = css`
  ${from.desktop} {
    width: calc(50% - ${space[3]}px);

    & > * + * {
      margin-top: ${space[6]}px;
    }
  }
`;

const buttonContainer = css`
  padding-top: ${space[6]}px;
  padding-bottom: ${space[6]}px;
`;

type ContributionThankYouProps = {|
  csrf: Csrf,
  subscribeToNewsLetter: (email: string, csrf: Csrf) => void,
|};

const mapStateToProps = state => ({
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


const ContributionThankYou = ({ csrf, subscribeToNewsLetter }: ContributionThankYouProps) => (
  <div css={container}>
    <ContributionThankYouHeader showDirectDebitMessage />

    <div css={columnsContainer}>
      <div css={columnContainer}>
        <ContributionThankYouContinueToAccount email="tom.pretty@guardian.co.uk" csrf={csrf} />
        <ContributionThankYouCompleteRegistration />
        <ContributionThankYouHearFromOurNewsroom subscribeToNewsLetter={() => subscribeToNewsLetter('tom.pretty@guardian.co.uk', csrf)} />
      </div>
      <div css={columnContainer}>
        <ContributionThankYouSetSupportReminder email="tom.pretty@guardian.co.uk" />
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
