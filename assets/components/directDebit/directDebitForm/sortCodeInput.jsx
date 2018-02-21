// @flow

// ----- Imports ----- //

import React from 'react';

type SortCodePropTypes = {
  value: string,
  onChange: Function,
};

type SortCodeStateType = {
  sortCodeValues: Array<string>,
  onChange: Function,
  sortCodeInputs: Array<?HTMLInputElement>,
};

export default class SortCodeInput extends React.Component<SortCodePropTypes, SortCodeStateType> {

  constructor(props: {value: string, onChange: Function}) {
    super(props);
    const split = props.value.match(/.{1,2}/g);
    this.state = {
      sortCodeValues: split || Array(3).fill(''),
      onChange: props.onChange,
      sortCodeInputs: Array(3),
    };
  }

  setFocus(index: number) {
    if (this.state.sortCodeValues[index].length === 2 && index < 2) {
      const nextInput = this.state.sortCodeInputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  handleUpdate(index: number, event: SyntheticInputEvent<HTMLInputElement>) {
    this.state.sortCodeValues[index] = event.target.value;
    this.state.onChange(this.state.sortCodeValues.join(''));
    this.setFocus(index);
  }

  render() {
    return (
      <div className="component-direct-debit-form__sort-code">
        <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
          Sort Code
        </label>
        <SortCodeField
          value={this.state.sortCodeValues[0]}
          onChange={value => this.handleUpdate(0, value)}
          refFunction={(input) => { this.state.sortCodeInputs[0] = input; }}
        />
        <span className="component-direct-debit-form_sort-code-separator">&mdash;</span>
        <SortCodeField
          value={this.state.sortCodeValues[1]}
          onChange={value => this.handleUpdate(1, value)}
          refFunction={(input) => { this.state.sortCodeInputs[1] = input; }}
        />
        <span className="component-direct-debit-form_sort-code-separator">&mdash;</span>
        <SortCodeField
          value={this.state.sortCodeValues[2]}
          onChange={value => this.handleUpdate(2, value)}
          refFunction={(input) => { this.state.sortCodeInputs[2] = input; }}
        />

      </div>
    );
  }
}

function SortCodeField(props: { value: string, onChange: Function, refFunction: Function }) {
  return (
    <input
      id="sort-code-field"
      value={props.value}
      onChange={props.onChange}
      ref={props.refFunction}
      type="text"
      className="component-direct-debit-form__sort-code-field"
    />
  );
}
