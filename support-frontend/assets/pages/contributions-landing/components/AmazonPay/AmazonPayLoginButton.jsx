// @flow

import React from 'react';
import {connect} from "react-redux";
import type {State, AmazonPayData} from "pages/contributions-landing/contributionsLandingReducer";
import { setAmazonPayHasAccessToken} from "pages/contributions-landing/contributionsLandingActions";
import Button from 'components/button/button';

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayLoginButtonReady: () => Action,
  setAmazonPayHasAccessToken: () => Action,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setAmazonPayHasAccessToken: () => dispatch(setAmazonPayHasAccessToken),
});

class AmazonPayLoginButtonComponent extends React.Component<PropTypes> {

  loginPopup = (): void  => {
    this.props.amazonPayData.amazonPayLibrary.amazonLoginObject.setSandboxMode(true);
    const loginOptions = { scope: 'profile postal_code payments:widget payments:shipping_address', popup: true };
    this.props.amazonPayData.amazonPayLibrary.amazonLoginObject.authorize(loginOptions, response => {
      if (response.error) {
        console.log("error", response.error)
      } else {
        const accessToken = response.access_token;
        console.log("Access token", accessToken);
        this.props.setAmazonPayHasAccessToken();
      }
    })
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
    } else {
      //TODO - spinner?
      console.log("amazon login button not ready")
      return null;
    }
  }
}

const AmazonPayLoginButton = connect(mapStateToProps, mapDispatchToProps)(AmazonPayLoginButtonComponent);
export default AmazonPayLoginButton
