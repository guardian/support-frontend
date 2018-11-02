// @flow

// ----- Imports ----- //

import type { CommonState } from 'helpers/page/page';
import { type IsoCountry } from 'helpers/internationalisation/country';


// ----- Types ----- //

type Stage = 'checkout' | 'thankyou';

type PageState = {
  stage: Stage;
  firstName: string,
  lastName: string,
  country: IsoCountry,
  telephone: string,
};

export type State = {
  common: CommonState,
  page: PageState,
};

type Action =
  | { type: 'SET_STAGE', stage: Stage }
  | { type: 'SET_FIRST_NAME', firstName: string }
  | { type: 'SET_LAST_NAME', lastName: string }
  | { type: 'SET_TELEPHONE', telephone: string }
  | { type: 'SET_COUNTRY', country: IsoCountry };


// ----- Action Creators ----- //

const actions = {
  setStage: (stage: Stage): Action => ({ type: 'SET_STAGE', stage }),
  setFirstName: (firstName: string): Action => ({ type: 'SET_FIRST_NAME', firstName }),
  setLastName: (lastName: string): Action => ({ type: 'SET_LAST_NAME', lastName }),
  setTelephone: (telephone: string): Action => ({ type: 'SET_TELEPHONE', telephone }),
  setCountry: (country: IsoCountry): Action => ({ type: 'SET_COUNTRY', country }),
};


// ----- Reducer ----- //

const initialState = {
  stage: 'checkout',
  firstName: '',
  lastName: '',
  country: 'GB',
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
      return { ...state, country: action.country };

    default:
      return state;

  }

}


// ----- Export ----- //

export {
  reducer,
  actions,
};
