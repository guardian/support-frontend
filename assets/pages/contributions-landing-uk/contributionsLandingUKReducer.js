// @flow

// ----- Imports ----- //

import {
  contributionSelectionReducerFor,
} from 'components/contributionSelection/contributionSelectionReducer';

import type { State } from 'components/contributionSelection/contributionSelectionReducer';


// ----- Types ----- //

export type PageState = State;


// ----- Reducer ----- //

export default contributionSelectionReducerFor('CONTRIBUTE_SECTION');
