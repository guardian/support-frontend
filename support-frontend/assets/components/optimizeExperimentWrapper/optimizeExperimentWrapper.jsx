// @flow

import { connect } from 'react-redux';
import type { OptimizeExperiments, OptimizeExperiment } from 'helpers/optimize/optimize';
import type { CommonState } from 'helpers/page/commonReducer';
import type { Node } from 'react';
import React from 'react';
import { getQueryParameter } from 'helpers/url';

export type ExperimentWrapperProps = {
  experimentId: string,
  experiments: OptimizeExperiments,
  children: Node,
}

function mapStateToProps(state: { common: CommonState }) {
  return {
    experiments: state.common.optimizeExperiments,
  };
}

function getExperiment(props: ExperimentWrapperProps): OptimizeExperiment | null {
  return props.experiments.find(exp => exp.id === props.experimentId) || null;
}

function OptimizeExperimentWrapper(props: ExperimentWrapperProps) {
  const experiment = getExperiment(props);

  const defaultVariant = Number(getQueryParameter('force_optimize_ab_variant')) || 0;

  if (experiment === null) {
    return React.Children.toArray(props.children)[defaultVariant];
  }

  const variant = Number(experiment.variant) || defaultVariant;
  return React.Children.toArray(props.children)[variant];
}

export default connect(mapStateToProps)(OptimizeExperimentWrapper);
