// @flow

import React, { Component } from 'react';
import { trackComponentLoad } from 'helpers/tracking/behaviour';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  elementID: string,
  callback: (string) => void,
  publicKey: string,
  action: string
|}

type StateTypes = {|
  loaded: boolean
|}

const defaultProps = {
  elementID: 'g-recaptcha',
  callback: (token: string) => console.log(token),
  publicKey: '6Le36d0UAAAAAJRqGjj8ADbrgr3diK1zUlu-7Qdm',
  action: 'submit',
};

const isCaptchaLoaded = () => window && window.grecaptcha && typeof window.grecaptcha.execute !== 'undefined';

let loadedCheck;

class Recaptcha extends Component<PropTypes, StateTypes> {
  defaultProps = defaultProps;

  constructor(props: PropTypes) {
    super(props);
    
    this.state = {
      loaded: isCaptchaLoaded(),
    };

    if (!this.state.loaded) {
      loadedCheck = setInterval(this.updateLoadedState.bind(this), 1000);
    }
  }

  componentDidMount() {
    trackComponentLoad('contributions-recaptcha-mounted');
    if (this.state.loaded) {
      this.execute();
    }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps: $ReadOnly<PropTypes>, prevState: $ReadOnly<StateTypes>, _: any) {
    if (this.state.loaded && !prevState.loaded) {
      this.execute();
    }
  }

  componentWillUnmount() {
    clearInterval(loadedCheck);
  }

  execute = () => {
    const {
      publicKey,
      callback,
      action,
    } = this.props;

    if (this.state.loaded) {
      window.grecaptcha.execute(publicKey, { action })
        .then((token) => {
          trackComponentLoad('contributions-recaptcha-client-token-received');
          callback(token);
        });
    }
  }

  updateLoadedState = () => {
    if (isCaptchaLoaded()) {
      this.setState(() => ({ loaded: true }));

      clearInterval(loadedCheck);
    }
  }

  render() {
    return this.state.loaded && <div id={this.props.elementID} className="g-recaptcha" />;
  }
}

export default Recaptcha;
