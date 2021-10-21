// ----- Imports ----- //
import React, { Component } from 'react';
import type { SharedButtonPropTypes } from './_sharedButton';
import SharedButton, { defaultProps } from './_sharedButton';
import './button.scss';
// ----- Render ----- //
type PropTypes = SharedButtonPropTypes & {
	'aria-label'?: string;
	type: ('button' | 'submit') | null | undefined;
	disabled?: boolean;
	trackingEvent?: () => void;
};

class TrackableButton extends Component<PropTypes> {
	static defaultProps = { ...defaultProps, type: 'button', disabled: false };

	componentDidMount() {
		if (this.props.trackingEvent) {
			this.props.trackingEvent();
		}
	}

	render() {
		return <SharedButton element="button" {...this.props} />;
	}
}

export default TrackableButton;
