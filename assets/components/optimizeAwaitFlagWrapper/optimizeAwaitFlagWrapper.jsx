// @flow

import { findOptimizeExperiments } from 'helpers/tracking/optimize';
import { setExperimentVariant } from 'helpers/optimize/optimizeActions';
import { connect } from 'react-redux';
import type { OptimizeExperiment, OptimizeState } from 'helpers/optimize/optimizeReducer';


export type AwaitOptimiseFlagProps = {
  experimentId: string,
  experiments: OptimizeExperiment[],
  setExperimentVariant: (variant: number) => void,
}

function mapStateToProps(state: OptimizeState, ownProps: {experimentId: string}) {
  return {
    experimentId: ownProps.experimentId,
    experiments: state.page.experiments,
  };
}

function getExperiment(props: AwaitOptimiseFlagProps) {
  if (props.experiments) {
    return props.experiments.find(exp => exp.id === props.experimentId);
  }
  return null;
}

function OptimizeAwaitFlagWrapper(props: AwaitOptimiseFlagProps) {
  // const callback = (variant: number) => {
  //   console.log(`Component callback - Experiment ${props.experimentId} is in variant ${variant}`);
  //   props.dispatch(setExperimentVariant({ id: props.experimentId, variant }));
  // };

  const experiment = getExperiment(props);
  if (experiment == null) {
    //findOptimizeExperiments(props.experimentId, callback);
    return props.children[0];
  }

  const variant = experiment.variant || 0;
  return props.children[variant];
}

export default connect(mapStateToProps)(OptimizeAwaitFlagWrapper);
