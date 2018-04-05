// @flow

// ----- Imports ----- //

import * as React from 'react';
import { trackComponentEvents } from 'helpers/tracking/ophanComponentEventTracking';
import type { OphanComponent, OphanAction } from 'helpers/tracking/ophanComponentEventTracking';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

// ----- Prop Types ----- //

type Props = {
  component: OphanComponent,
  action: OphanAction,
  children?: React.Node,
};


// ----- Component ----- //
// This is a non-functional component so we can use the componentDidMount event,
// which is not available in stateless components

class TrackedComponent extends React.Component<Props> {

  static defaultProps = {
    action: 'INSERT',
    children: null,
  }
  componentDidMount() {
    trackComponentEvents(this.props.action, this.props.component);
  }

  render() {

    const acquisitionData: ReferrerAcquisitionData = {
      referrerPageviewId: undefined,
      referrerUrl: window.location.href,
      campaignCode: this.props.component.campaignCode,
      componentId: this.props.component.id,
      componentType: 'ACQUISITIONS_OTHER',
      source: 'GUARDIAN_WEB',
      abTest: undefined,
      abTests: undefined,
      queryParameters: undefined,
    };

    const childrenWithProps = React.Children.map(
      this.props.children,
      child => React.cloneElement(child, {
        trackComponentEvent: (eventName: OphanAction, id: string) =>
          trackComponentEvents(eventName, this.props.component, id),
        acquisitionData,
      }),
    );

    return (<div>{childrenWithProps}</div>);
  }
}

export default TrackedComponent;
