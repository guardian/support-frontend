// ----- Imports ----- //
import React from "react";
import type { SortCodeIndex, Phase } from "components/directDebit/directDebitActions";
type SortCodePropTypes = {
  phase: Phase;
  sortCodeArray: Array<string>;
  onChange: (arg0: SortCodeIndex, arg1: React.SyntheticEvent<HTMLInputElement>) => void;
};

function SortCodeInput(props: SortCodePropTypes) {
  const editable = <span>
      <SortCodeField id="qa-sort-code-1" value={props.sortCodeArray[0]} onChange={event => props.onChange(0, event)} />
      <span className="component-direct-debit-form__sort-code-separator">&mdash;</span>
      <SortCodeField id="qa-sort-code-2" value={props.sortCodeArray[1]} onChange={event => props.onChange(1, event)} />
      <span className="component-direct-debit-form__sort-code-separator">&mdash;</span>
      <SortCodeField id="qa-sort-code-3" value={props.sortCodeArray[2]} onChange={event => props.onChange(2, event)} />
    </span>;
  const locked = <span>
      {props.sortCodeArray[0]}-{props.sortCodeArray[1]}-{props.sortCodeArray[2]}
    </span>;
  return <div className="component-direct-debit-form__sort-code">
      <label htmlFor="sort-code-input" className="component-direct-debit-form__field-label">
        Sort Code
      </label>
      {props.phase === 'entry' ? editable : locked}
    </div>;
}

// ----- Auxiliary components ----- //
function SortCodeField(props: {
  id: string;
  value: string;
  onChange: (arg0: React.SyntheticEvent<HTMLInputElement>) => void;
}) {
  return <input id={props.id} value={props.value} onChange={props.onChange} type="tel" pattern="[0-9][0-9]" minLength={2} maxLength={2} className="component-direct-debit-form__sort-code-field focus-target" />;
} // ----- Exports ----- //


export default SortCodeInput;