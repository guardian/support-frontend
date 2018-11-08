// @flow

import { connect } from 'react-redux';
import type { OptimizeExperiments } from 'helpers/optimize/optimize';
import type { CommonState } from 'helpers/page/commonReducer';
import type { Node } from 'preact-compat';


export type ExperimentWrapperProps = {
  experimentId: string,
  experiments: OptimizeExperiments,
  children: Node,
}

function mapStateToProps(
  state: { common: CommonState },
  ownProps: {experimentId: string, children: Node},
): ExperimentWrapperProps {
  return {
    experimentId: ownProps.experimentId,
    experiments: state.common.optimizeExperiments,
    children: ownProps.children,
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
