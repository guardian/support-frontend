// @flow

// ----- Imports ----- //

import type { IsoCountry } from 'helpers/internationalisation/country';
import type { OptimizeExperiment } from 'helpers/optimize/optimize';


// ----- Types ----- //

export type Action =
  | { type: 'SET_COUNTRY', country: IsoCountry }
  | { type: 'SET_OPTIMIZE_EXPERIMENT_VARIANT', experiment: OptimizeExperiment };


// ----- Action Creators ----- //

function setCountry(country: IsoCountry): Action {
  return { type: 'SET_COUNTRY', country };
}

function setExperimentVariant(experiment: OptimizeExperiment): Action {
  return { type: 'SET_OPTIMIZE_EXPERIMENT_VARIANT', experiment };
}

// ----- Exports ----- //

export { setCountry, setExperimentVariant };
