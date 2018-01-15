// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  id: ?string,
  onChange: (preference: boolean) => void,
  checked: boolean,
  labelTitle?: string,
  labelCopy?: string,
};


// ----- Component ----- //

export default function CheckboxInput(props: PropTypes) {
  let labelTitle = '';
  let labelCopy = '';

  if (props.id) {
    if (props.labelTitle) {
      // eslint-disable-next-line jsx-a11y/label-has-for
      labelTitle = <p className="component-checkbox__title">{props.labelTitle}</p>;
    }
    if (props.labelCopy) {
      // eslint-disable-next-line jsx-a11y/label-has-for
      labelCopy = <p className="component-checkbox__copy" >{props.labelCopy}</p>;
    }
  }

  return (
    <label htmlFor={props.id} className="component-checkbox">
      <input
        className="component-checkbox__checkbox"
        id={props.id}
        type="checkbox"
        onChange={e => props.onChange(e.target.checked)}
        checked={props.checked}
      />
      {labelTitle}
      {labelCopy}
    </label>
  );
}

CheckboxInput.defaultProps = {
  labelCopy: '',
  labelTitle: '',
};
