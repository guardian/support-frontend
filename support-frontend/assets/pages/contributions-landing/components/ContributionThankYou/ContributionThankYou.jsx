// @flow
// $FlowIgnore - required for hooks
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { type User } from 'helpers/user/userReducer';
import { type PaymentMethod, DirectDebit } from 'helpers/forms/paymentMethods';
import type { ContributionType } from 'helpers/contributions';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import {
  from,
  between,
  until,
  breakpoints,
} from '@guardian/src-foundations/mq';
import { neutral } from '@guardian/src-foundations/palette';
import { LinkButton } from '@guardian/src-button';
import ContributionThankYouHeader from './ContributionThankYouHeader';
import ContributionThankYouSignIn from './ContributionThankYouSignIn';
import ContributionThankYouSignUp from './ContributionThankYouSignUp';
import ContributionThankYouMarketingConsent from './ContributionThankYouMarketingConsent';
import ContributionThankYouSupportReminder from './ContributionThankYouSupportReminder';
import ContributionThankYouSurvey from './ContributionThankYouSurvey';
import ContributionThankYouSocialShare from './ContributionThankYouSocialShare';
import ContributionThankYouAusMap from './ContributionThankYouAusMap';
import {
  trackUserData,
  OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN,
} from './utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { getCampaignSettings, type CampaignSettings } from 'helpers/campaigns/campaigns';
import { getAmount } from 'helpers/contributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';

const container = css`
  background: white;
  padding: 0 ${space[3]}px;
  margin: 0 auto;

  ${from.tablet} {
    background: none;
    max-width: ${breakpoints.tablet}px;
  }

  ${from.desktop} {
    max-width: ${breakpoints.desktop}px;
  }

  ${from.leftCol} {
    max-width: ${breakpoints.leftCol}px;
  }

  ${from.wide} {
    max-width: ${breakpoints.wide}px;
  }
`;

const headerContainer = css`
  ${from.desktop} {
    width: 60%;
  }
  ${from.leftCol} {
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

const isLargeDonation = (
  amount: string,
  contributionType: ContributionType,
): boolean => {
  const largeDonations = {
    MONTHLY: 20,
    ANNUAL: 100,
    ONE_OFF: 100,
  };

  return parseFloat(amount) >= largeDonations[contributionType];
};

type ContributionThankYouProps = {|
  csrf: Csrf,
  email: string,
  contributionType: ContributionType,
  amount: string,
  currency: IsoCurrency,
  name: string,
  user: User,
  guestAccountCreationToken: string,
  paymentMethod: PaymentMethod,
  countryId: IsoCountry,
  campaignCode: ?string,
|};

const mapStateToProps = state => ({
  email: state.page.form.formData.email,
  name: state.page.form.formData.firstName,
  contributionType: state.page.form.contributionType,
  amount: getAmount(
    state.page.form.selectedAmounts,
    state.page.form.formData.otherAmounts,
    state.page.form.contributionType,
  ),
  currency: state.common.internationalisation.currencyId,
  csrf: state.page.csrf,
  user: state.page.user,
  guestAccountCreationToken: state.page.form.guestAccountCreationToken,
  paymentMethod: state.page.form.paymentMethod,
  countryId: state.common.internationalisation.countryId,
  campaignCode: state.common.referrerAcquisitionData.campaignCode,
});

const ContributionThankYou = ({
  csrf,
  email,
  name,
  contributionType,
  amount,
  currency,
  user,
  guestAccountCreationToken,
  paymentMethod,
  countryId,
  campaignCode,
}: ContributionThankYouProps) => {
  const isKnownEmail = guestAccountCreationToken === null;
  const campaignSettings = useMemo<CampaignSettings | null>(() =>
    getCampaignSettings(campaignCode));

  useEffect(() => {
    trackUserData(
      paymentMethod,
      contributionType,
      user.isSignedIn,
      isKnownEmail,
      isLargeDonation(amount, contributionType),
    );
  }, []);

  const signUpAction = {
    component: <ContributionThankYouSignUp email={email} csrf={csrf} />,
    shouldShow: !isKnownEmail,
  };
  const signInAction = {
    component: <ContributionThankYouSignIn email={email} csrf={csrf} />,
    shouldShow: isKnownEmail && !user.isSignedIn,
  };
  const marketingConsentAction = {
    component: (
      <ContributionThankYouMarketingConsent
        email={email}
        csrf={csrf}
      />
    ),
    shouldShow: true,
  };
  const supportReminderAction = {
    component: (
      <ContributionThankYouSupportReminder
        email={email}
      />
    ),
    shouldShow: contributionType === 'ONE_OFF',
  };

  const surveyAction = {
    component: <ContributionThankYouSurvey />,
    shouldShow: true,
  };

  const socialShareAction = {
    component: (
      <ContributionThankYouSocialShare
        email={email}
        createReferralCodes={
          campaignSettings && campaignSettings.createReferralCodes
        }
        campaignCode={campaignSettings && campaignSettings.campaignCode}
      />
    ),
    shouldShow: true,
  };
  const ausMapAction = {
    component: <ContributionThankYouAusMap />,
    shouldShow: countryId === 'AU',
  };

  const defaultActions = [
    signUpAction,
    signInAction,
    marketingConsentAction,
    supportReminderAction,
    surveyAction,
    socialShareAction,
  ];

  const ausActions = [
    signUpAction,
    signInAction,
    marketingConsentAction,
    supportReminderAction,
    surveyAction,
    ausMapAction,
    socialShareAction,
  ];

  const actions = countryId === 'AU' ? ausActions : defaultActions;

  const shownComponents = actions
    .filter(action => action.shouldShow)
    .map(action => action.component);

  const numberOfComponentsInFirstColumn = shownComponents.length >= 6 ? 3 : 2;

  const firstColumn = shownComponents.slice(0, numberOfComponentsInFirstColumn);
  const secondColumn = shownComponents.slice(numberOfComponentsInFirstColumn);

  return (
    <div css={container}>
      <div css={headerContainer}>
        <ContributionThankYouHeader
          name={name}
          showDirectDebitMessage={paymentMethod === DirectDebit}
          paymentMethod={paymentMethod}
          contributionType={contributionType}
          amount={amount}
          currency={currency}
          shouldShowLargeDonationMessage={isLargeDonation(amount, contributionType)}
        />
      </div>

      <div css={columnsContainer}>
        <div css={columnContainer}>{firstColumn}</div>
        <div css={columnContainer}>{secondColumn}</div>
      </div>

      <div css={buttonContainer}>
        <LinkButton
          href="https://www.theguardian.com"
          priority="tertiary"
          onClick={() =>
            trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
          }
        >
          Return to the Guardian
        </LinkButton>
      </div>
    </div>
  );
};
export default connect(mapStateToProps)(ContributionThankYou);
