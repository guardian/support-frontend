// @flow

import type { OptimizeExperiment } from 'helpers/optimize/optimizeReducer';

export type Action =
  | { type: 'SET_EXPERIMENT_VARIANT', experiment: OptimizeExperiment };

const setExperimentVariant = (experiment: OptimizeExperiment): Action =>
  ({ type: 'SET_EXPERIMENT_VARIANT', experiment });

export { setExperimentVariant };
