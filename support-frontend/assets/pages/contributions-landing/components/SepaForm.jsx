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
  iban: string,
  accountHolderName: string,
  accountHolderConfirmation: boolean,
  updateIban: (iban: string) => void,
  updateAccountHolderName: (accountHolderName: string) => void,
  updateAccountHolderConfirmation: (accountHolderConfirmation: boolean) => void,
|};

export function SepaForm({
  iban,
  accountHolderName,
  accountHolderConfirmation,
  updateIban,
  updateAccountHolderName,
  updateAccountHolderConfirmation,
}: DirectDebitFormProps) {

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
        </div>

        <div>
          <TextInput
            label="Account number"
            pattern="[0-9]*"
            minLength="6"
            maxLength="10"
            value={iban}
            onChange={e => updateIban(e.target.value)}
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
