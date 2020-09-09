// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { type User } from 'helpers/user/userReducer';
import { type PaymentMethod, DirectDebit } from 'helpers/paymentMethods';
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

const NUMBER_OF_ACTIONS_IN_FIRST_COLUNM = 2;

type ContributionThankYouProps = {|
  csrf: Csrf,
  email: string,
  user: User,
  guestAccountCreationToken: string,
  paymentMethod: PaymentMethod,
  subscribeToNewsLetter: (email: string, csrf: Csrf) => void
|};

const mapStateToProps = state => ({
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
  user: state.page.user,
  guestAccountCreationToken: state.page.form.guestAccountCreationToken,
  paymentMethod: state.page.form.paymentMethod,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    subscribeToNewsLetter: (email: string, csrf: Csrf) => {
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

const ContributionThankYou = ({
  csrf,
  email,
  user,
  guestAccountCreationToken,
  paymentMethod,
  subscribeToNewsLetter,
}: ContributionThankYouProps) => {
  const actions = [];

  if (guestAccountCreationToken) {
    actions.push(<ContributionThankYouCompleteRegistration email={email} csrf={csrf} />);
  } else if (!user.isSignedIn) {
    actions.push(<ContributionThankYouContinueToAccount email={email} csrf={csrf} />);
  }
  if (!user.gnmMarketing) {
    actions.push(<ContributionThankYouHearFromOurNewsroom
      subscribeToNewsLetter={() => subscribeToNewsLetter(email, csrf)}
    />);
  }
  if (!user.isRecurringContributor) {
    actions.push(<ContributionThankYouSetSupportReminder email={email} />);
  }
  actions.push(<ContributionThankYouSendYourThoughts />);
  actions.push(<ContributionThankYouShareYourSupport />);

  const firstColumn = actions.slice(0, NUMBER_OF_ACTIONS_IN_FIRST_COLUNM - 1);
  const secondColumn = actions.slice(NUMBER_OF_ACTIONS_IN_FIRST_COLUNM);

  return (
    <div css={container}>
      <div css={headerContainer}>
        <ContributionThankYouHeader
          showDirectDebitMessage={paymentMethod === DirectDebit}
        />
      </div>

      <div css={columnsContainer}>
        <div css={columnContainer}>
          {firstColumn}
        </div>
        <div css={columnContainer}>
          {secondColumn}
        </div>
      </div>

      <div css={buttonContainer}>
        <LinkButton priority="tertiary">Return to the Guardian</LinkButton>
      </div>
    </div>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContributionThankYou);
