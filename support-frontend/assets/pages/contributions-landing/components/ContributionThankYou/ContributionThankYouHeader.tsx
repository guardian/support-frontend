import * as React from "react";
import { css } from "@emotion/core";
import { titlepiece, body } from "@guardian/src-foundations/typography";
import { space } from "@guardian/src-foundations";
import { from } from "@guardian/src-foundations/mq";
import type { ContributionType } from "helpers/contributions";
import { currencies, spokenCurrencies } from "helpers/internationalisation/currency";
import type { IsoCurrency } from "helpers/internationalisation/currency";
import type { PaymentMethod } from "helpers/forms/paymentMethods";
import { formatAmount } from "helpers/forms/checkouts";
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
const amountText = css`
  background-color: #ffe500;
  padding: 0 5px;
`;
type ContributionThankYouHeaderProps = {
  name: string | null;
  showDirectDebitMessage: boolean;
  paymentMethod: PaymentMethod;
  contributionType: ContributionType;
  amount: string;
  currency: IsoCurrency;
  shouldShowLargeDonationMessage: boolean;
};
const MAX_DISPLAY_NAME_LENGTH = 10;

const ContributionThankYouHeader = ({
  name,
  showDirectDebitMessage,
  paymentMethod,
  contributionType,
  amount,
  currency,
  shouldShowLargeDonationMessage
}: ContributionThankYouHeaderProps) => {
  const title = (): React.ReactNode => {
    const nameAndTrailingSpace: string = name && name.length < MAX_DISPLAY_NAME_LENGTH ? `${name} ` : '';
    // Do not show special header to paypal/one-off as we don't have the relevant info after the redirect
    const payPalOneOff = paymentMethod === 'PayPal' && contributionType === 'ONE_OFF';

    if (!payPalOneOff && amount) {
      const currencyAndAmount = <span css={amountText}>
          {formatAmount(currencies[currency], spokenCurrencies[currency], parseFloat(amount), false)}
        </span>;

      switch (contributionType) {
        case 'ONE_OFF':
          return <div>
              Thank you for supporting us today with {currencyAndAmount} ❤️
            </div>;

        case 'MONTHLY':
          return <div>
              Thank you {nameAndTrailingSpace}for choosing to contribute{' '}
              {currencyAndAmount} each month ❤️
            </div>;

        case 'ANNUAL':
          return <div>
              Thank you {nameAndTrailingSpace}for choosing to contribute{' '}
              {currencyAndAmount} each year ❤️
            </div>;

        default:
          return <div>
              Thank you {nameAndTrailingSpace}for your valuable contribution
            </div>;
      }
    } else {
      return <div>
          Thank you {nameAndTrailingSpace}for your valuable contribution
        </div>;
    }
  };

  const AdditionalCopy = () => {
    const mainText = shouldShowLargeDonationMessage ? 'It’s not every day that we receive such a generous contribution – thank you. We would love to stay in touch. So that we can, please pick the add-ons that suit you best. ' : 'To support us further, and enhance your experience with the Guardian, select the add-ons that suit you best. ';

    const MarketingCopy = () => <span>
        {shouldShowLargeDonationMessage ? 'We’ll be in touch to bring you closer to our journalism. Please select the extra add-ons that suit you best. ' : 'As you’re now a valued supporter, we’ll be in touch to bring you closer to our journalism. '}
        You can amend your email preferences at any time via{' '}
        <a href="https://manage.theguardian.com">your account
        </a>.
      </span>;

    return <>
        {mainText}
        {contributionType !== 'ONE_OFF' && <MarketingCopy />}
      </>;
  };

  return <header css={header}>
      <h1 css={headerTitleText}>{title()}</h1>
      <p css={headerSupportingText}>
        {showDirectDebitMessage && <>
            <span css={directDebitSetupText}>
              Your Direct Debit has been set up.{' '}
            </span>
            Look out for an email within three business days confirming your
            recurring payment. This will appear as &apos;Guardian Media
            Group&apos; on your bank statements.
            <br />
            <br />
          </>}
        <AdditionalCopy />
      </p>
    </header>;
};

export default ContributionThankYouHeader;