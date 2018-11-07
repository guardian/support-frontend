// @flow

// ----- Imports ----- //

import type { Action } from './optimizeActions';


// ----- Setup ----- //

export type OptimizeExperiment = {
  id: string,
  variant: number,
}

export type OptimizeState = {
  experiments: OptimizeExperiment[]
};

const initialState: OptimizeState = {
  experiments: [],
};

export default function optimizeReducer(
  state: OptimizeState = initialState,
  action: Action,
) {
  switch (action.type) {
    case 'SET_EXPERIMENT_VARIANT': {
      const experiments = state.experiments
        .filter(exp => exp.id !== action.experiment.id)
        .concat(action.experiment);
      return { ...state, experiments };
    }
    default:
      return state;
  }
}
