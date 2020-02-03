// @flow

// ----- Imports ----- //

import React from 'react';
import type { Phase } from 'components/directDebit/directDebitActions';

type SortCodePropTypes = {
  value: string,
  phase: Phase,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
};

function SortCodeInput(props: SortCodePropTypes) {
  const editable = (
    <input
      id="sort-code-input"
      value={props.value}
      onChange={props.onChange}
      pattern="[0-9][0-9][0-9][0-9][0-9][0-9]"
      minLength={6}
      maxLength={6}
      className="component-direct-debit-form__sort-code-field focus-target component-direct-debit-form__text-field"
    />
  );

  const locked = (
    <span>
      {props.value}
    </span>
  );

  return (
    <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
        Sort code
      </label>
      {props.phase === 'entry' ? editable : locked}
    </div>
  );
}

// ----- Exports ----- //

export default SortCodeInput;
