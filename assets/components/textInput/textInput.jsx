// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function TextInput(props) {

  const selectedClass = props.selected ? ' component-text-input--selected' : '';

  return (
    <input
      className={`component-text-input${selectedClass}`}
      type="text"
      placeholder="Other Amount (£)"
      onFocus={e => props.onFocus(e.target.value)}
      onInput={e => props.onInput(e.target.value)}
    />
  );

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  onFocus: () => {},
  onInput: () => {},
  selected: false,
};

TextInput.propTypes = {
  onFocus: React.PropTypes.func,
  onInput: React.PropTypes.func,
  selected: React.PropTypes.bool,
};
