// @flow

// ----- Imports ----- //

import React from 'react';
import Heading from 'components/heading/heading';

import 'components/forms/customFields/error.scss';

// ----- Types ----- //

type PropTypes = {
  errors: Array<Object>,
}

// ----- Render ----- //

export const ErrorSummary = (props: PropTypes) => (
  <div className="component-form-error__border">
    <Heading className="component-form-error__heading" size={2}>There is a problem</Heading>
    <ul>
      {props.errors.map((error) => {
        if (error.message === 'Temporary COVID message') {
          return (
            <li className="component-form-error__summary-error">
              The address and postcode you entered is outside of our delivery area. You may want to
              consider purchasing a <a href="/uk/subscribe/paper">voucher subscription</a>
            </li>);
        }
        return (
          <li className="component-form-error__summary-error">
            {error.message}
          </li>);
      })}
    </ul>
  </div>
);

