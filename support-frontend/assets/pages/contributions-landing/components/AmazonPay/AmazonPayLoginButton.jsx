// @flow

import React from 'react';
import {connect} from "react-redux";
import type {State, AmazonPayData} from "pages/contributions-landing/contributionsLandingReducer";
import { setAmazonPayLoginButtonReady } from "pages/contributions-landing/contributionsLandingActions";
import { getQueryParameter } from 'helpers/url';

const canCreateWidget = (amazonPayData: AmazonPayData) =>
  amazonPayData.amazonPayLibrary && !amazonPayData.loginButtonReady;

const getAccessToken = (): ?string => getQueryParameter('access_token');

type PropTypes = {|
  amazonPayData: AmazonPayData,
  setAmazonPayLoginButtonReady: () => Action,
|}

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData,
});

const mapDispatchToProps = (dispatch: Function) => ({
  setAmazonPayLoginButtonReady: dispatch(setAmazonPayLoginButtonReady),
});

class AmazonPayLoginButtonComponent extends React.Component<PropTypes> {
  createWidget(): void {
    console.log("creating widget")
    this.props.amazonPayData.amazonPayLibrary.amazonPaymentsObject.Button(
      'AmazonLoginButton',
      window.guardian.amazonPaySellerId.ONE_OFF.uat,  // TODO - get id properly
      {
        type: 'PwA',
        color: 'DarkGray',
        size: 'medium',
        authorization: () => {
          // TODO - popup false?
          const loginOptions = { scope: 'profile postal_code payments:widget payments:shipping_address', popup: true };
          const authRequest = this.props.amazonPayData.amazonPayLibrary.amazonLoginObject.authorize(loginOptions, window.location.href);
        },
        onError: (error) => {
          // something bad happened
          debugger;
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
          Amazon Pay!
          <div id="AmazonLoginButton" />
        </div>
      );
    } else {
      //TODO - spinner?
      console.log("amazon not ready")
      return null;
    }
  }
}

const AmazonPayLoginButton = connect(mapStateToProps, mapDispatchToProps)(AmazonPayLoginButtonComponent);
export default AmazonPayLoginButton
