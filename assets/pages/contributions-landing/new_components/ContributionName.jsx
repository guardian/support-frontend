// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

// ----- Types ----- //

type PropTypes = {
  id: string,
  name: string,
  label: string,
  required?: boolean
};

// ----- Render ----- //

function ContributionName(props: PropTypes) {
  return (
    <div className={`form__field form__field--${props.name}`}>
      <label className="form__label" htmlFor={props.id}>{props.label}</label>
      <span className="form__input-with-icon">
        <input id={props.id} className="form__input" type="text" autoCapitalize="words" required={props.required} />
        <span className="form__icon">
          <svg width="14" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M6.99 7.381c1.433 0 3.121-1.66 3.121-3.683C10.111 1.674 8.953.5 6.991.5 5.026.5 3.888 1.674 3.888 3.698c0 2.023 1.825 3.683 3.101 3.683zM2.333 9.789l-.797.83L0 16.69l.758.81h12.445l.797-.81-1.556-6.071-.777-.83C10.11 9.283 8.692 9 7 9c-1.711 0-3.111.243-4.667.79z" fillRule="evenodd" /></svg>
        </span>
      </span>
    </div>
  );
}

const mapStateToProps = () => ({
  required: false,
});

const NewContributionName = connect(mapStateToProps)(ContributionName);

export { NewContributionName };
