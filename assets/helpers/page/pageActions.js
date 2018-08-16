// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import { type OptimizeExperiments } from 'helpers/tracking/optimize';


// ----- Types ----- //

export type Action =
  | { type: 'SET_COUNTRY', country: IsoCountry }
  | { type: 'SET_OPTIMIZE_EXPERIMENTS', experiments: OptimizeExperiments };


// ----- Action Creators ----- //

function setCountry(country: IsoCountry): Action {
  return { type: 'SET_COUNTRY', country };
}

function setOptimizeExperiments(experiments: OptimizeExperiments): Action {
  return { type: 'SET_OPTIMIZE_EXPERIMENTS', experiments };
}


// ----- Exports ----- //

export {
  setCountry,
  setOptimizeExperiments,
};
