// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { headline } from '@guardian/src-foundations/typography';
import { TextInput } from '@guardian/src-text-input';
import { Checkbox } from '@guardian/src-checkbox';

// -- Styles -- //

const containerStyles = css`
  padding-top: ${space[5]}px;
`;

const headerStyles = css`
  ${headline.xxxsmall({ fontWeight: 'bold' })}
`;

const fieldsContainerStyles = css`
  margin-top: ${space[4]}px;
  > * + * {
    margin-top: ${space[3]}px;
  }
`;

const checkboxContainerStyles = css`
  margin-top: ${space[5]}px;
`;

// -- Component -- //

type DirectDebitFormProps = {|
  accountNumber: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  sortCodeSegments: string[],
  updateAccountNumber: (accountNumber: string) => void,
  updateAccountHolderName: (accountHolderName: string) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => void,
  updateSortCodeSegments: (sortCodeSegments: string[]) => void,
|};

export function SepaForm({
                                  accountNumber,
                                  accountHolderName,
                                  accountHolderConfirmation,
                                  sortCodeSegments,
                                  updateAccountNumber,
                                  updateAccountHolderName,
                                  updateAccountHolderConfirmation,
                                  updateSortCodeSegments,
                                }: DirectDebitFormProps) {

  const sortCode = sortCodeSegments.join('');

  const onSortCodeChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const updatedSortCode = event.target.value;

    updateSortCodeSegments([
      updatedSortCode.slice(0, 2),
      updatedSortCode.slice(2, 4),
      updatedSortCode.slice(4, 6),
    ]);
  };

  return (
    <div css={containerStyles}>
      <h3 css={headerStyles}>Your account details</h3>

      <div css={fieldsContainerStyles}>
        <div>
          <TextInput
            label="Bank account holder name"
            maxLength="40"
            value={accountHolderName}
            onChange={e => updateAccountHolderName(e.target.value)}
          />
        </div>

        <div>
          <TextInput
            label="Sort code"
            width={10}
            pattern="[0-9]*"
            minLength="6"
            maxLength="6"
            value={sortCode}
            onChange={onSortCodeChange}
          />
        </div>

        <div>
          <TextInput
            label="Account number"
            pattern="[0-9]*"
            minLength="6"
            maxLength="10"
            value={accountNumber}
            onChange={e => updateAccountNumber(e.target.value)}
          />
        </div>
      </div>

      <div css={checkboxContainerStyles}>
        <Checkbox
          supporting="I confirm that I am the account holder and I am solely able to authorise debit from the account"
          checked={accountHolderConfirmation}
          onChange={e => updateAccountHolderConfirmation(e.target.checked)}
        />
      </div>
    </div>
  );
}
