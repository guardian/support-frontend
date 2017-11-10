// @flow

// ----- Imports ----- //

import * as React from 'react';
import { trackComponentEvents } from 'helpers/tracking/ophanComponentEventTracking';
import type { OphanComponent, OphanAction } from 'helpers/tracking/ophanComponentEventTypes';

type PropTypes = {
  component: OphanComponent,
  action?: OphanAction,
  children?: React.Node,
};

// ----- Component ----- //

export default function trackedComponent(props: PropTypes) {
  trackComponentEvents(props.action || trackedComponent.defaultProps.action, props.component);
  return (<div>{props.children}</div>);
}


// ----- Default Props ----- //

trackedComponent.defaultProps = {
  action: 'INSERT',
  children: null,
};
