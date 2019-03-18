// @flow
import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
  OptedIn, Unset,
} from '../../helpers/tracking/thirdPartyTrackingConsent';
import {
  type Action,
  setTrackingConsent,
} from '../../helpers/page/commonActions';
import type { ThirdPartyTrackingConsent } from '../../helpers/tracking/thirdPartyTrackingConsent';
import Roundel from './roundel.svg';
import Tick from './tick.svg';
import 'components/consentBanner/consentBanner.scss';

export type PropTypes = {
  trackingConsent: ThirdPartyTrackingConsent,
  onAccepted: Function,
}

function mapStateToProps(state) {
  return {
    trackingConsent: state.common.trackingConsent,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onAccepted: () => {
      dispatch(setTrackingConsent(OptedIn));
    },
  };
}

function ConsentBanner(props: PropTypes) {
  if (props.trackingConsent === Unset) {
    return (
      <div className="consent-banner--first-pv-consent">
        <div className="consent-banner__roundel">
          <span className="inline-icon"><Roundel /></span>
        </div>
        <div className="consent-banner__copy">
          <div className="consent-banner--first-pv-consent__block consent-banner--first-pv-consent__block--head">
            Your privacy
          </div>
          <div className="consent-banner--first-pv-consent__block consent-banner--first-pv-consent__block--intro">
            <p>We use cookies to improve your experience on our site and to show you personalised advertising.</p>
            <p>To find out more, read our&nbsp;
              <a
                className="u-underline"
                href="https://www.theguardian.com/help/privacy-policy"
              >
                privacy policy
              </a>&nbsp;and&nbsp;
              <a
                className="u-underline"
                href="https://www.theguardian.com/info/cookies"
              >
                cookie policy
              </a>.
            </p>
          </div>
          <div className="consent-banner--first-pv-consent__actions">
            <button onClick={props.onAccepted} className="consent-banner--first-pv-consent__button">
              <span className="inline-icon">
                <Tick />
              </span>
              <span>I&#39;m OK with that</span>
            </button>
            <a
              href="https://profile.theguardian.com/privacy-settings"
              className="consent-banner--first-pv-consent__link u-underline"
            >
              My options
            </a>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsentBanner);
