
// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import type { Contrib } from 'helpers/contributions';

// ---- Types ----- //

type PropTypes = {|
  contributionType: Contrib,
  isRecurringContributor: boolean,
  checkoutFormHasBeenSubmitted: boolean,
|};


// ----- Component ----- //

export const ExistingRecurringContributorErrorMessage = (props: PropTypes) => {

  const manageUrl = 'https://manage.theguardian.com/contributions?INTCPM=existing-contributor-from-support';

  const onClick = (event) => {
    event.preventDefault();
    trackComponentClick('send-to-mma-already-contributor');
    window.location.assign(manageUrl);
  };

  if (props.contributionType === 'ONE_OFF' || !props.isRecurringContributor || !props.checkoutFormHasBeenSubmitted) {
    return null;
  }

  return (
    <a className={classNameWithModifiers('form__error', ['existing-contributor'])} href={manageUrl} onClick={onClick}>
        You already have recurring contribution. You can visit <span className="underline">manage my account</span> to give us more, if you wanna.
    </a>);

};
