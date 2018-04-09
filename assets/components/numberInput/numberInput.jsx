// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithOptModifier } from 'helpers/utilities';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

type PropTypes = {
  onFocus: (string, CountryGroupId) => void,
  onInput: (string, CountryGroupId) => void,
  countryGroupId: CountryGroupId,
  selected: ?boolean,
  placeholder: ?string,
  onKeyPress: ?(event: Object) => void,
  ariaDescribedBy: ?string,
  labelText?: ?string,
};


// ----- Functions ----- //

function getLabel(labelText: ?string) {

  if (labelText) {
    return <span className="component-number-input__label">{labelText}</span>;
  }

  return null;

}


// ----- Component ----- //

export default function NumberInput(props: PropTypes) {

  const selectedClass = props.selected ? 'selected' : null;

  return (
    <div className={classNameWithOptModifier('component-number-input', selectedClass)}>
      {getLabel(props.labelText)}
      <input
        className="component-number-input__input"
        type="number"
        placeholder={props.placeholder}
        onFocus={e => props.onFocus(e.target.value || '', props.countryGroupId)}
        onInput={e => props.onInput(e.target.value || '', props.countryGroupId)}
        onKeyPress={props.onKeyPress}
        aria-describedby={props.ariaDescribedBy}
      />
    </div>
  );

}


// ----- Default Props ----- //

NumberInput.defaultProps = {
  labelText: null,
};
