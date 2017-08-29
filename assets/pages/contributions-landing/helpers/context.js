// @flow

// ----- Imports ----- //

import { getQueryParameter } from 'helpers/url';
import { parseBoolean } from 'helpers/utilities';

import { setContext } from '../actions/contributionsLandingActions';
import type { Action } from '../actions/contributionsLandingActions';


// ----- Functions ----- //

function saveContext(dispatch: Action => void) {

  const context = getQueryParameter('context', 'false');

  if (context) {
    dispatch(setContext(parseBoolean(context, false)));
  }

}


// ----- Exports ----- //

export {
  saveContext,
};
