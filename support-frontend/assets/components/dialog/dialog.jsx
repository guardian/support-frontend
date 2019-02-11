// @flow

// ----- Imports ----- //

import React, { Component, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities';

import './dialog.scss';


// ----- Props ----- //

export type PropTypes = {|
  onStatusChange: (boolean) => void,
  styled: boolean,
  open: boolean,
  'aria-label': Option<string>,
  blocking: boolean,
  children: Node
|};


// ----- Component ----- //

class Dialog extends Component<PropTypes> {

  static defaultProps = {
    onStatusChange: () => {},
    styled: true,
    open: false,
    blocking: true,
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
      this.ref.showModal();
    }
    /*
    if the browser supports <dialog>
    its gonna be better than us
    at dealing with auto focus
    */
    if (this.ref && !this.ref.showModal) {
      requestAnimationFrame(() => {
        if (this.ref) {
          this.ref.focus();
        }
      });
    }
  }

  close() {
    if (this.ref && this.ref.close) {
      this.ref.close();
    }
  }

  ref: ?(HTMLDialogElement & {focus: Function});

  render() {
    const {
      open, children, onStatusChange, blocking, styled, ...otherProps
    } = this.props;
    return (
    // eslint-disable-next-line jsx-a11y/no-redundant-roles, jsx-a11y/no-noninteractive-element-interactions
      <dialog
        className={classNameWithModifiers('component-dialog', [
          open ? 'open' : null,
          styled ? 'styled' : null,
        ])}
        aria-modal
        aria-hidden={!open}
        tabIndex="-1"
        role="dialog"
        onOpen={() => { onStatusChange(true); }}
        onCancel={() => { onStatusChange(false); }}
        ref={(d) => { this.ref = (d: any); }}
        onKeyUp={((ev) => {
          if (ev.key === 'Escape') {
            onStatusChange(false);
          }
        })}
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
        <div
          className="component-dialog__backdrop"
          aria-hidden
          onClick={() => !blocking && onStatusChange(false)}
        />
      </dialog>
    );
  }
}


// ----- Exports ----- //

export default Dialog;
