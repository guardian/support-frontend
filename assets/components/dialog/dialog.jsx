// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import './dialog.scss';


// ----- Props ----- //

export type PropTypes = {|
  onStatusChange: (boolean) => void,
  modal: boolean,
  open: boolean,
  dismissOnBackgroundClick: boolean,
  children: Node
|};


// ----- Component ----- //

class Dialog extends Component<PropTypes> {

  static defaultProps = {
    onStatusChange: () => {},
    modal: true,
    open: false,
    dismissOnBackgroundClick: true,
  }

  componentDidMount() {
    if (this.props.open) {
      this.open();
    }
  }

  componentDidUpdate(prevProps: PropTypes) {
    if (prevProps.open === true && this.props.open === false) {
      this.close();
    } else if (prevProps.open === false && this.props.open === true) {
      this.open();
    }
  }

  open() {
    if (this.ref && this.ref.showModal) {
      if (this.props.modal) {
        this.ref.showModal();
      } else {
        this.ref.show();
      }
      requestAnimationFrame(() => {
        this.ref.focus();
      });
    }
  }

  close() {
    if (this.ref && this.ref.close) {
      this.ref.close();
    }
  }

  ref: any;

  render() {
    const {
      open, children, onStatusChange, dismissOnBackgroundClick,
    } = this.props;

    return (
      <dialog
        className="component-dialog"
        tabIndex="-1"
        onOpen={() => { onStatusChange(true); }}
        onCancel={() => { onStatusChange(false); }}
        ref={(d) => { this.ref = d; }}
        data-open={open}
      >
        <div className="component-dialog__contents">
          {children}
        </div>
        <div
          className="component-dialog__backdrop"
          aria-hidden
          onClick={() => dismissOnBackgroundClick && onStatusChange(false)}
        />
      </dialog>
    );
  }
}


// ----- Exports ----- //

export default Dialog;
