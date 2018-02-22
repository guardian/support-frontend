// @flow

// ----- Imports ----- //

import React from 'react';

type SortCodePropTypes = {
  sortCode: Array<string>,
  onChange: Function,
};

export default function SortCodeInput(props: SortCodePropTypes) {

  return (
    <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
        Sort Code
      </label>
      <SortCodeField
        value={props.sortCode[0]}
        onChange={event => props.onChange(0, event)}
      />
      <span className="component-direct-debit-form_sort-code-separator">&mdash;</span>
      <SortCodeField
        value={props.sortCode[1]}
        onChange={event => props.onChange(1, event)}
      />
      <span className="component-direct-debit-form_sort-code-separator">&mdash;</span>
      <SortCodeField
        value={props.sortCode[2]}
        onChange={event => props.onChange(2, event)}
      />
    </div>
  );
}

function SortCodeField(props: { value: string, onChange: Function}) {
  return (
    <input
      id="sort-code-field"
      value={props.value}
      onChange={props.onChange}
      type="text"
      className="component-direct-debit-form__sort-code-field"
    />
  );
}
