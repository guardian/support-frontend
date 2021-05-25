// @flow

// ----- Imports ----- //
import React from 'react';
import { type SelectedAmounts } from 'helpers/contributions';
import { type ContributionType } from 'helpers/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
  type IsoCurrency,
  currencies,
  spokenCurrencies,
} from 'helpers/internationalisation/currency';
import { formatAmount } from 'helpers/forms/checkouts';
import { ChoiceCardGroup, ChoiceCard } from '@guardian/src-choice-card';
import ContributionAmountChoicesChoiceLabel from './ContributionAmountChoicesChoiceLabel';
import { from, until } from '@guardian/src-foundations/mq';
import { css } from '@emotion/core';

const choiceCardGroupOverrides = css`
  > div {
    ${until.leftCol} {
      flex-wrap: wrap;
    }
    margin-top: -8px;
  }

  > div > label {
    ${from.tablet} {
      max-width: 100px;
    }
    margin-top: 8px !important;
  }
`;

const choiceCardGrid = css`
  ${from.mobileLandscape} {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
  }
`;

type ContributionAmountChoicesProps = {|
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  contributionType: ContributionType,
  validAmounts: number[],
  defaultAmount: number,
  showOther: boolean,
  selectedAmounts: SelectedAmounts,
  selectAmount: (
    number | "other",
    CountryGroupId,
    ContributionType
  ) => () => void,
  shouldShowFrequencyButtons: boolean
|};

const isSelected = (
  amount: number,
  selectedAmounts: SelectedAmounts,
  contributionType: ContributionType,
  defaultAmount: number,
) => {
  if (selectedAmounts[contributionType]) {
    return (
      selectedAmounts[contributionType] !== 'other' &&
      amount === selectedAmounts[contributionType]
    );
  }
  return amount === defaultAmount;
};

const ContributionAmountChoices = (props: ContributionAmountChoicesProps) =>
  (props.shouldShowFrequencyButtons ? (
    <ContributionAmountChoicesTwoColumnAfterMobile {...props} />
  ) : (
    <ContributionAmountChoicesDefault {...props} />
  ));

const ContributionAmountChoicesDefault = ({
  validAmounts,
  defaultAmount,
  countryGroupId,
  contributionType,
  showOther,
  selectAmount,
  selectedAmounts,
  currency,
  shouldShowFrequencyButtons,
}: ContributionAmountChoicesProps) => (
  <ChoiceCardGroup name="amounts" css={choiceCardGroupOverrides}>
    {validAmounts.map((amount: number) => (
      <ChoiceCard
        id={`contributionAmount-${amount}`}
        name="contributionAmount"
        value={amount}
        checked={isSelected(
          amount,
          selectedAmounts,
          contributionType,
          defaultAmount,
        )}
        onChange={selectAmount(amount, countryGroupId, contributionType)}
        label={
          <ContributionAmountChoicesChoiceLabel
            formattedAmount={formatAmount(
              currencies[currency],
              spokenCurrencies[currency],
              amount,
              false,
            )}
            shouldShowFrequencyButtons={shouldShowFrequencyButtons}
            contributionType={contributionType}
          />
        }
      />
    ))}
    <ChoiceCard
      id="contributionAmount-other"
      name="contributionAmount"
      value="other"
      checked={showOther}
      onChange={selectAmount('other', countryGroupId, contributionType)}
      label="Other"
    />
  </ChoiceCardGroup>
);

const ContributionAmountChoicesTwoColumnAfterMobile = ({
  validAmounts,
  defaultAmount,
  countryGroupId,
  contributionType,
  showOther,
  selectAmount,
  selectedAmounts,
  currency,
  shouldShowFrequencyButtons,
}: ContributionAmountChoicesProps) => (
  <ChoiceCardGroup name="amounts">
    <div css={choiceCardGrid}>
      {validAmounts.map((amount: number) => (
        <div>
          <ChoiceCard
            id={`contributionAmount-${amount}`}
            name="contributionAmount"
            value={amount}
            checked={isSelected(
              amount,
              selectedAmounts,
              contributionType,
              defaultAmount,
            )}
            onChange={selectAmount(amount, countryGroupId, contributionType)}
            label={
              <ContributionAmountChoicesChoiceLabel
                formattedAmount={formatAmount(
                  currencies[currency],
                  spokenCurrencies[currency],
                  amount,
                  false,
                )}
                shouldShowFrequencyButtons={shouldShowFrequencyButtons}
                contributionType={contributionType}
              />
            }
          />
        </div>
      ))}
      <div>
        <ChoiceCard
          id="contributionAmount-other"
          name="contributionAmount"
          value="other"
          checked={showOther}
          onChange={selectAmount('other', countryGroupId, contributionType)}
          label="Other"
        />
      </div>
    </div>
  </ChoiceCardGroup>
);

export default ContributionAmountChoices;
