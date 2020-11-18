// @flow
import React from 'react';
import { css } from '@emotion/core';
import { titlepiece, body } from '@guardian/src-foundations/typography';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import type {ContributionType} from "helpers/contributions";
import { currencies } from 'helpers/internationalisation/currency';
import type {IsoCurrency} from "helpers/internationalisation/currency";
import type {PaymentMethod} from "helpers/paymentMethods";

const header = css`
  background: white;
  padding-top: ${space[4]}px;
  padding-bottom: ${space[5]}px;

  ${from.tablet} {
    background: none;
  }
`;

const headerTitleText = css`
  ${titlepiece.small()};
  font-size: 24px;

  ${from.tablet} {
    font-size: 40px;
  }
`;

const headerSupportingText = css`
  ${body.small()};
  padding-top: ${space[3]}px;

  ${from.tablet} {
    font-size: 17px;
  }
`;

const directDebitSetupText = css`
  font-weight: bold;
`;

type ContributionThankYouHeaderProps = {|
  name: string | null,
  showDirectDebitMessage: boolean,
  paymentMethod: PaymentMethod,
  contributionType: ContributionType,
  amount: string,
  currency: IsoCurrency,
  thankyouPageHeadingTestVariant: boolean,
|};

const MAX_DISPLAY_NAME_LENGTH = 10;

const ContributionThankYouHeader = ({
  name,
  showDirectDebitMessage,
  paymentMethod,
  contributionType,
  amount,
  currency,
  thankyouPageHeadingTestVariant,
}: ContributionThankYouHeaderProps) => {

  const title = (): string => {
    const nameAndTrailingSpace: string = name && name.length < MAX_DISPLAY_NAME_LENGTH ? `${name} ` : '';
    // Do not show special header to paypal/one-off as we don't have the relevant info after the redirect
    const payPalOneOff = paymentMethod === 'PayPal' && contributionType === 'ONE_OFF';

    if (thankyouPageHeadingTestVariant && !payPalOneOff && amount) {
      const currencyAndAmount = `${currencies[currency].glyph}${amount}`;

      switch (contributionType) {
        case 'ONE_OFF':
          return `Thank you for supporting us today with ${currencyAndAmount} ❤️`;
        case 'MONTHLY':
          return `Thank you ${nameAndTrailingSpace}for choosing to contribute ${currencyAndAmount} each month ❤️`;
        case 'ANNUAL':
          return `Thank you ${nameAndTrailingSpace}for choosing to contribute ${currencyAndAmount} each year ❤️`;
        default:
          return `Thank you ${nameAndTrailingSpace}for your valuable contribution`;
      }
    } else {
      return `Thank you ${nameAndTrailingSpace}for your valuable contribution`
    }
  };

  return (
    <header css={header}>
      <h1 css={headerTitleText}>
        {title()}
      </h1>
      <p css={headerSupportingText}>
        {showDirectDebitMessage && (
          <>
            <span css={directDebitSetupText}>
              Your Direct Debit has been set up.{' '}
            </span>
            Look out for an email within three business days confirming your
            recurring payment. This will appear as &apos;Guardian Media
            Group&apos; on your bank statements.
            <br />
            <br />
          </>
        )}
        To support us further, and enhance your experience with the Guardian,
        select the add-ons that suit you best.
      </p>
    </header>
  );
};

export default ContributionThankYouHeader;
