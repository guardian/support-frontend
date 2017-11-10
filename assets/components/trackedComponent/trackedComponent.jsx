// @flow

// ----- Imports ----- //

import * as React from 'react';
import { trackComponentEvents } from 'helpers/tracking/ophanComponentEventTracking';
import type { OphanComponent, OphanAction } from 'helpers/tracking/ophanComponentEventTypes';

// ----- Prop Types ----- //

type Props = {
  component: OphanComponent,
  action: OphanAction,
  children?: React.Node,
};


// ----- Component ----- //

class TrackedComponent extends React.Component<Props> {

  static defaultProps = {
    action: 'INSERT',
    children: null,
  }
  componentDidMount() {
    trackComponentEvents(this.props.action, this.props.component);
  }

  render() {

    const childrenWithProps = React.Children.map(
      this.props.children,
      child => React.cloneElement(child, {
        trackComponentEvent: (eventName: OphanAction, id: string) =>
          trackComponentEvents(eventName, this.props.component, id),
      }),
    );

    return (<div>{childrenWithProps}</div>);
  }
}

export default TrackedComponent;
