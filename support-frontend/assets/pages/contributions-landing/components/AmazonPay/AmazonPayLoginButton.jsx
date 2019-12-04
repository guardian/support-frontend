// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { State, AmazonPayData } from 'pages/contributions-landing/contributionsLandingReducer';
import { setAmazonPayHasAccessToken } from 'pages/contributions-landing/contributionsLandingActions';
import Button from 'components/button/button';
import { logException } from 'helpers/logger';

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayHasAccessToken: () => Action,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setAmazonPayHasAccessToken: () => dispatch(setAmazonPayHasAccessToken),
});

class AmazonPayLoginButtonComponent extends React.Component<PropTypes> {

  loginPopup = (): void => {
    const loginOptions = { scope: 'profile postal_code payments:widget payments:shipping_address', popup: true };
    this.props.amazonPayData.amazonPayLibrary.amazonLoginObject.authorize(loginOptions, (response) => {
      if (response.error) {
        logException(`Error from Amazon login: ${response.error}`);
      } else {
        this.props.setAmazonPayHasAccessToken();
      }
    });
  };

  render() {
    if (this.props.amazonPayData.amazonPayLibrary) {
      return (
        <div>
          <div id="AmazonLoginButton" />
          <Button type="button" onclick={this.loginPopup} aria-label="Submit contribution">
            Proceed with Amazon Pay
          </Button>
        </div>
      );
    }
    // TODO - spinner?
    console.log('amazon login button not ready');
    return null;

  }
}

const AmazonPayLoginButton = connect(mapStateToProps, mapDispatchToProps)(AmazonPayLoginButtonComponent);
export default AmazonPayLoginButton;
