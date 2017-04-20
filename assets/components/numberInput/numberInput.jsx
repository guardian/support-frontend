// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function NumberInput(props) {

  const selectedClass = props.selected ? ' component-number-input--selected' : '';

  return (
    <input
      className={`component-number-input${selectedClass}`}
      type="number"
      placeholder={props.placeholder}
      onFocus={e => props.onFocus(e.target.value)}
      onInput={e => props.onInput(e.target.value)}
    />
  );

}


// ----- Proptypes ----- //

NumberInput.defaultProps = {
  onFocus: () => {},
  onInput: () => {},
  selected: false,
  placeholder: null,
};

NumberInput.propTypes = {
  onFocus: React.PropTypes.func,
  onInput: React.PropTypes.func,
  selected: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
};
