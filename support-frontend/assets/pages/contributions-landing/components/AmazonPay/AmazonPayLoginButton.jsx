// @flow

import React from 'react';
import {connect} from "react-redux";
import type {State, AmazonPayData} from "pages/contributions-landing/contributionsLandingReducer";
import { setAmazonPayLoginButtonReady } from "pages/contributions-landing/contributionsLandingActions";
import { getQueryParameter } from 'helpers/url';

const canCreateWidget = (amazonPayData: AmazonPayData) =>
  amazonPayData.amazonPayLibrary && !amazonPayData.loginButtonReady;

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayLoginButtonReady: () => Action,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setAmazonPayLoginButtonReady: () => dispatch(setAmazonPayLoginButtonReady),
});

class AmazonPayLoginButtonComponent extends React.Component<PropTypes> {
  createWidget(): void {
    this.props.amazonPayData.amazonPayLibrary.amazonPaymentsObject.Button(
      'AmazonLoginButton',
      window.guardian.amazonPaySellerId.ONE_OFF.uat,  // TODO - get id properly
      {
        type: 'PwA',
        color: 'DarkGray',
        size: 'medium',
        authorization: () => {
          // Note - popup=true means it opens in a separate window. If we set it to false then the redirect url must be whitelisted
          // in Seller Central, which would be a nightmare because we have custom urls for campaigns
          const loginOptions = { scope: 'profile postal_code payments:widget payments:shipping_address', popup: true };
          const authRequest = this.props.amazonPayData.amazonPayLibrary.amazonLoginObject.authorize(loginOptions, window.location.href);
        },
        onError: (error) => {
          console.log("login button error", error.getErrorMessage());
        },
      }
    );

    this.props.setAmazonPayLoginButtonReady();
  }

  componentDidMount(): void {
    if (canCreateWidget(this.props.amazonPayData)) {
      this.createWidget();
    }
  }

  componentDidUpdate(): void {
    if (canCreateWidget(this.props.amazonPayData)) {
      this.createWidget();
    }
  }

  render() {
    if (this.props.amazonPayData.amazonPayLibrary) {
      return (
        <div>
          <div id="AmazonLoginButton" />
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
