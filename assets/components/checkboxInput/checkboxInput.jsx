// @flow

// ----- Imports ----- //

import * as React from 'react';


// ----- Types ----- //

type PropTypes = {
  id: ?string,
  onChange: (preference: boolean) => void,
  checked: boolean,
  labelTitle?: string,
  labelCopy?: string,
};


// ----- Component ----- //

const CheckboxInput: (PropTypes) => React.Node = (props: PropTypes) => {
  let labelTitle = '';
  let labelCopy = '';

  if (props.labelTitle) {
    labelTitle = <p className="component-checkbox__title">{props.labelTitle}</p>;
  }
  if (props.labelCopy) {
    labelCopy = <p className="component-checkbox__copy" >{props.labelCopy}</p>;
  }

  return (
    <span>
      {labelTitle}
      <label htmlFor={props.id}>
        <input
          className="component-checkbox__checkbox"
          id={props.id}
          type="checkbox"
          onChange={e => props.onChange(e.target.checked)}
          checked={props.checked}
        />
        {labelCopy}
      </label>
    </span>
  );
};

CheckboxInput.defaultProps = {
  labelCopy: '',
  labelTitle: '',
};

export default CheckboxInput;
