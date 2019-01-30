// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';

import './dialog.scss';


// ----- Props ----- //

export type PropTypes = {|
  onStatusChange: (boolean) => void,
  modal: boolean,
  open: boolean,
  'aria-label': Option<string>,
  dismissOnBackgroundClick: boolean,
  children: Node
|};


// ----- Component ----- //

class Dialog extends Component<PropTypes> {

  static defaultProps = {
    onStatusChange: () => {},
    modal: true,
    open: false,
    dismissOnBackgroundClick: false,
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
    }
    requestAnimationFrame(() => {
      if (this.ref) {
        this.ref.focus();
      }
    });
  }

  close() {
    if (this.ref && this.ref.close) {
      this.ref.close();
    }
  }

  ref: ?(HTMLDialogElement & {focus: Function});

  render() {
    const {
      open, modal, children, onStatusChange, dismissOnBackgroundClick, ...otherProps
    } = this.props;

    return (
      <dialog // eslint-disable-line jsx-a11y/no-redundant-roles
        className={classNameWithModifiers('component-dialog', [modal ? 'modal' : null, open ? 'open' : null])}
        aria-modal={modal}
        aria-hidden={!open}
        tabIndex="-1"
        role="dialog"
        onOpen={() => { onStatusChange(true); }}
        onCancel={() => { onStatusChange(false); }}
        ref={(d) => { this.ref = (d: any); }}
        {...otherProps}
      >
        <div className="component-dialog__contents">
          {children}
          <div
            tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
            onFocus={() => {
              /* this acts as a cheap focus trap */
              if (this.ref) { this.ref.focus(); }
            }}
          />
        </div>
        {modal &&
          <div
            className="component-dialog__backdrop"
            aria-hidden
            onClick={() => dismissOnBackgroundClick && onStatusChange(false)}
          />
        }
      </dialog>
    );
  }
}


// ----- Exports ----- //

export default Dialog;
