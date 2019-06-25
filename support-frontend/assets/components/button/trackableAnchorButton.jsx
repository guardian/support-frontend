// @flow

// ----- Imports ----- //

import React, { Component } from 'react';

import SharedButton, { defaultProps, type SharedButtonPropTypes } from './_sharedButton';
import './button.scss';

// ----- Render ----- //

export type PropTypes = {
  ...SharedButtonPropTypes,
  'aria-label': ?string,
  href: string,
  trackingEvent?: () => void
};

class TrackableAnchorButton extends Component<PropTypes> {
  static defaultProps = {
    ...defaultProps,
  };

  componentDidMount() {
    if (this.props.trackingEvent) {
      this.props.trackingEvent();
    }
  }

  render() {
    return (
      <SharedButton
        element="button"
        {...this.props}
      />
    );
  }
}

export default TrackableAnchorButton;
