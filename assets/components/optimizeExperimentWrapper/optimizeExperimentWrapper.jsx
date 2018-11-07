// @flow

import { connect } from 'react-redux';
import type { OptimizeExperiment, OptimizeState } from 'helpers/optimize/optimizeReducer';


export type ExperimentWrapperProps = {
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

function getExperiment(props: ExperimentWrapperProps) {
  if (props.experiments) {
    return props.experiments.find(exp => exp.id === props.experimentId);
  }
  return null;
}

function OptimizeExperimentWrapper(props: ExperimentWrapperProps) {
  const experiment = getExperiment(props);

  if (experiment == null) {
    return props.children[0];
  }

  const variant = experiment.variant || 0;
  return props.children[variant];
}

export default connect(mapStateToProps)(OptimizeExperimentWrapper);
