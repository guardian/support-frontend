// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';
import { type IsoCountry, fromString } from 'helpers/internationalisation/country';


// ----- Types ----- //

export type Stage = 'checkout' | 'thankyou';

export type FormFields = {|
  firstName: string,
  lastName: string,
  country: IsoCountry | null,
  telephone: string,
|};

type PageState = {|
  stage: Stage,
  ...FormFields,
|};

export type State = {
  common: CommonState,
  page: PageState,
};

export type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_COUNTRY', country: string };


// ----- Action Creators ----- //

const setStage = (stage: Stage): Action => ({ type: 'SET_STAGE', stage });

const formActionCreators = {
  setFirstName: (firstName: string): Action => ({ type: 'SET_FIRST_NAME', firstName }),
  setLastName: (lastName: string): Action => ({ type: 'SET_LAST_NAME', lastName }),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setCountry: (country: string): Action => ({ type: 'SET_COUNTRY', country }),
};

export type FormActionCreators = typeof formActionCreators;


// ----- Selectors ----- //

function formFieldsSelector(state: State): FormFields {
  return {
    firstName: state.page.firstName,
    lastName: state.page.lastName,
    country: state.page.country,
    telephone: state.page.telephone,
  };
}


// ----- Reducer ----- //

const initialState = {
  stage: 'checkout',
  firstName: '',
  lastName: '',
  country: null,
  telephone: '',
};

function reducer(state: PageState = initialState, action: Action): PageState {

  switch (action.type) {

    case 'SET_STAGE':
      return { ...state, stage: action.stage };

    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.firstName };

    case 'SET_LAST_NAME':
      return { ...state, lastName: action.lastName };

    case 'SET_TELEPHONE':
      return { ...state, telephone: action.telephone };

    case 'SET_COUNTRY':
      return { ...state, country: fromString(action.country) };

    default:
      return state;

  }

}


// ----- Export ----- //

export {
  reducer,
  setStage,
  formFieldsSelector,
  formActionCreators,
};
