import React from "react";
import { connect } from "react-redux";
import type { State, AmazonPayData } from "pages/contributions-landing/contributionsLandingReducer";
import type { Action } from "pages/contributions-landing/contributionsLandingActions";
import { setAmazonPayHasAccessToken } from "pages/contributions-landing/contributionsLandingActions";
import Button from "components/button/button";
import { logException } from "helpers/utilities/logger";
import AnimatedDots from "components/spinners/animatedDots";
import { trackComponentClick, trackComponentLoad } from "helpers/tracking/behaviour";
type PropTypes = {
  amazonPayData: AmazonPayData;
  setAmazonPayHasAccessToken: () => Action;
};

const mapStateToProps = (state: State) => ({
  amazonPayData: state.page.form.amazonPayData
});

const mapDispatchToProps = (dispatch: (...args: Array<any>) => any) => ({
  setAmazonPayHasAccessToken: () => dispatch(setAmazonPayHasAccessToken)
});

class AmazonPayLoginButtonComponent extends React.Component<PropTypes> {
  loginPopup = (amazonLoginObject: Record<string, any>) => (): void => {
    trackComponentClick('amazon-pay-login-click');
    const loginOptions = {
      scope: 'profile postal_code payments:widget payments:shipping_address',
      popup: true
    };
    amazonLoginObject.authorize(loginOptions, response => {
      if (response.error) {
        logException(`Error from Amazon login: ${response.error}`);
      } else {
        this.props.setAmazonPayHasAccessToken();
      }
    });
  };

  render() {
    const {
      amazonLoginObject,
      amazonPaymentsObject
    } = this.props.amazonPayData.amazonPayLibrary;

    if (amazonLoginObject && amazonPaymentsObject) {
      trackComponentLoad('amazon-pay-login-loaded');
      return <div>
          <div id="AmazonLoginButton" />
          <Button type="button" onClick={this.loginPopup(amazonLoginObject)} aria-label="Submit contribution">
            Proceed with Amazon Pay
          </Button>
        </div>;
    }

    return <AnimatedDots appearance="dark" />;
  }

}

const AmazonPayLoginButton = connect(mapStateToProps, mapDispatchToProps)(AmazonPayLoginButtonComponent);
export default AmazonPayLoginButton;