// @flow

// ----- Imports ----- //

import React from 'react';
import type { SortCodeIndex } from 'components/directDebit/directDebitActions';

type SortCodePropTypes = {
  sortCodeArray: Array<string>,
  onChange: (SortCodeIndex, SyntheticInputEvent<HTMLInputElement>) => void,
};

function SortCodeInput(props: {phase: string, sortCode: SortCodePropTypes}) {
  const editable = (
    <span>
      <SortCodeField
        value={props.sortCode.sortCodeArray[0]}
        onChange={event => props.sortCode.onChange(0, event)}
      />
      <span className="component-direct-debit-form__sort-code-separator">&mdash;</span>
      <SortCodeField
        value={props.sortCode.sortCodeArray[1]}
        onChange={event => props.sortCode.onChange(1, event)}
      />
      <span className="component-direct-debit-form__sort-code-separator">&mdash;</span>
      <SortCodeField
        value={props.sortCode.sortCodeArray[2]}
        onChange={event => props.sortCode.onChange(2, event)}
      />
    </span>
  );

  const locked = (
    <span>
      {props.sortCode.sortCodeArray[0]}
      <span className="component-direct-debit-form__sort-code-separator">&mdash;</span>
      {props.sortCode.sortCodeArray[1]}
      <span className="component-direct-debit-form__sort-code-separator">&mdash;</span>
      {props.sortCode.sortCodeArray[2]}
    </span>
  );

  return (
    <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
        Sort Code
      </label>
      {props.phase === 'entry' ? editable : locked}
    </div>
  );
}

// ----- Auxiliary components ----- //

function SortCodeField(props: {
  value: string,
  onChange: (SyntheticInputEvent<HTMLInputElement>) => void
}) {
  return (
    <input
      id="sort-code-field"
      value={props.value}
      onChange={props.onChange}
      type="text"
      maxLength={2}
      className="component-direct-debit-form__sort-code-field focus-target"
    />
  );
}


// ----- Exports ----- //

export default SortCodeInput;
