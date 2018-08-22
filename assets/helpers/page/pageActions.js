// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';


// ----- Types ----- //

export type Action =
  | { type: 'SET_COUNTRY', country: IsoCountry };


// ----- Action Creators ----- //

function setCountry(country: IsoCountry): Action {
  return { type: 'SET_COUNTRY', country };
}


// ----- Exports ----- //

export { setCountry };
