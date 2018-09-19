// @flow

// ----- Imports ----- //

import React from 'react';
import SvgArrowRight from 'components/svgs/arrowRightStraight';
import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //

// ----- Render ----- //


function CreateAccountButton() {

  const accessibilityHintId = 'accessibility-hint-create-account';

  return (
    <div className="form__submit">
      <button
        className={classNameWithModifiers("form__submit-button", ['create-account'])}
        type="submit"
        aria-describedby="accessibility-hint-create-account"
      >
        Create an account
        <p id={accessibilityHintId} className="accessibility-hint">Create an account</p>
        <SvgArrowRight />
      </button>
    </div>
  );
}

export { CreateAccountButton };
