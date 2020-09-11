// @flow
import React from 'react';
import { connect } from 'react-redux';
import { type User } from 'helpers/user/userReducer';
import { type PaymentMethod, DirectDebit } from 'helpers/paymentMethods';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from, between, until } from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import { LinkButton } from '@guardian/src-button';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouContinueToAccount from './ContributionThankYouContinueToAccount';
import ContributionThankYouCompleteRegistration from './ContributionThankYouCompleteRegistration';
import ContributionThankYouHearFromOurNewsroom from './ContributionThankYouHearFromOurNewsroom';
import ContributionThankYouSetSupportReminder from './ContributionThankYouSetSupportReminder';
import ContributionThankYouSendYourThoughts from './ContributionThankYouSendYourThoughts';
import ContributionThankYouShareYourSupport from './ContributionThankYouShareYourSupport';
import ContributionThankYouAusMap from './ContributionThankYouAusMap';
import { type ContributionType } from 'helpers/contributions';

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

  ${until.tablet} {
    border-top: 1px solid ${neutral[86]};
    border-bottom: 1px solid ${neutral[86]};
    & > * + * {
      border-top: 1px solid ${neutral[86]};
    }
  }

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
  ${until.tablet} {
    & > * + * {
      border-top: 1px solid ${neutral[86]};
    }
  }

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
  padding: ${space[12]}px 0;
`;

const NUMBER_OF_ACTIONS_IN_FIRST_COLUNM = 2;

type ContributionThankYouProps = {|
  csrf: Csrf,
  email: string,
  contributionType: ContributionType,
  name: string,
  user: User,
  guestAccountCreationToken: string,
  paymentMethod: PaymentMethod,
  countryId: IsoCountry
|};

const mapStateToProps = state => ({
  email: state.page.form.formData.email,
  name: state.page.form.formData.firstName,
  contributionType: state.page.form.formData.contributionType,
  csrf: state.page.csrf,
  user: state.page.user,
  guestAccountCreationToken: state.page.form.guestAccountCreationToken,
  paymentMethod: state.page.form.paymentMethod,
  countryId: state.common.internationalisation.countryId,
});

const ContributionThankYou = ({
  csrf,
  email,
  name,
  contributionType,
  user,
  guestAccountCreationToken,
  paymentMethod,
  countryId,
}: ContributionThankYouProps) => {
  const actions = [];

  if (guestAccountCreationToken) {
    actions.push(<ContributionThankYouCompleteRegistration email={email} csrf={csrf} />);
  } else if (!user.isSignedIn) {
    actions.push(<ContributionThankYouContinueToAccount email={email} csrf={csrf} />);
  }
  actions.push(<ContributionThankYouHearFromOurNewsroom email={email} csrf={csrf} />);
  if (contributionType === 'ONE_OFF') {
    actions.push(<ContributionThankYouSetSupportReminder email={email} />);
  }
  actions.push(<ContributionThankYouSendYourThoughts />);
  actions.push(<ContributionThankYouShareYourSupport />);
  if (countryId === 'AU') {
    actions.push(<ContributionThankYouAusMap />);
  }

  const firstColumn = actions.slice(0, NUMBER_OF_ACTIONS_IN_FIRST_COLUNM);
  const secondColumn = actions.slice(NUMBER_OF_ACTIONS_IN_FIRST_COLUNM);

  return (
    <div css={container}>
      <div css={headerContainer}>
        <ContributionThankYouHeader
          name={name}
          showDirectDebitMessage={paymentMethod === DirectDebit}
        />
      </div>

      <div css={columnsContainer}>
        <div css={columnContainer}>{firstColumn}</div>
        <div css={columnContainer}>{secondColumn}</div>
      </div>

      <div css={buttonContainer}>
        <LinkButton href="https://www.theguardian.com" priority="tertiary">
          Return to the Guardian
        </LinkButton>
      </div>
    </div>
  );
};
export default connect(mapStateToProps)(ContributionThankYou);
