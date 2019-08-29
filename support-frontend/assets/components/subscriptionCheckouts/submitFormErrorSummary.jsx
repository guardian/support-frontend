// @flow

// ----- Imports ----- //

import React from 'react';
import Heading from 'components/heading/heading';

import 'components/forms/customFields/error.scss';
import './subscriptionSubmitButton.scss';

// ----- Types ----- //

type PropTypes = {
  errors: Array<Object>,
}

// ----- Render ----- //

export const ErrorSummary = (props: PropTypes) => (
  <div className="component-form-error__border">
    <Heading className="component-form-error__heading" size={2}>There is a problem</Heading>
    <ul>
      {props.errors.map(error => (
        <li className="component-form-error__summary-error">
          {error.message}
        </li>
      ))}
    </ul>
  </div>
);

