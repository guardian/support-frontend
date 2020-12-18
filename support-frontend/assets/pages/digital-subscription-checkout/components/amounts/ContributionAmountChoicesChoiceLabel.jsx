// @flow

import React from 'react';
import { type ContributionType } from 'helpers/contributions';
import { css } from '@emotion/core';

type ContributionAmountLabelProps = {
  formattedAmount: string,
  shouldShowFrequencyButtons: boolean,
  contributionType: ContributionType
};

const ContributionAmountChoicesChoiceLabel = ({
  formattedAmount,
  shouldShowFrequencyButtons,
  contributionType,
}: ContributionAmountLabelProps) => {
  let frequencyLabel = '';
  if (shouldShowFrequencyButtons) {
    if (formattedAmount === '£11.99') {
      frequencyLabel = ' per month (no extra contribution)';
    } else
      if (formattedAmount === '£15') {
        frequencyLabel = ' per month (recommended)';
      } else {
      frequencyLabel = ' per month';
    }
  }

  return (
    <div css={css`white-space: nowrap`}>
      {formattedAmount}{frequencyLabel}
    </div>
  );
};

export default ContributionAmountChoicesChoiceLabel;
