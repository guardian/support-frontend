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
          <span
            className="inline-marque-36 inline-icon u-vertical-align-middle-icon"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              className="u-vertical-align-middle-icon__svg inline-marque-36__svg inline-icon__svg"
            >
              <path d="M18 0a18 18 0 1 0 0 36 18 18 0 0 0 0-36" />
              <path
                fill="#FFF"
                d="M21.2 4.4c2.3.4 5.3 2 6.3 3.1v5.2H27L21.2 5v-.6zm-2.2.4c-4 0-6.3 5.6-6.3 13.2 0 7.7 2.2 13.3 6.3 13.3v.6c-6 .4-14.4-4.2-14-13.8A13.3 13.3 0 0 1 19 4v.7zm10.4 14.4l-1.9.9v8.6c-1 1-3.8 2.6-6.3 3.1V19.9l-2.2-.7v-.6h10.4v.6z"
              />
            </svg>
          </span>
        </div>
        <div className="consent-banner__copy js-consent-banner-copy u-cf">
          <div
            className="consent-banner--first-pv-consent__block consent-banner--first-pv-consent__block--head"
          >Your
            privacy
          </div>
          <div
            className="consent-banner--first-pv-consent__block consent-banner--first-pv-consent__block--intro"
          >
            <p>We use cookies to improve your experience on our site and to show
              you
              personalised advertising.
            </p>
            <p>To find out more, read our
              <a
                className="u-underline"
                data-link-name="first-pv-consent : to-privacy"
                href="https://www.theguardian.com/help/privacy-policy"
              >
                privacy policy
              </a> and
              <a
                className="u-underline"
                data-link-name="first-pv-consent : to-cookies"
                href="https://www.theguardian.com/info/cookies"
              >
                cookie policy
              </a>.
            </p>
          </div>
          <div className="consent-banner--first-pv-consent__actions">
            <button
              data-link-name="first-pv-consent : agree"
              onClick={props.onAccepted}
              className="consent-banner--first-pv-consent__button consent-banner--first-pv-consent__button--main js-first-pv-consent-agree"
            >
              <span className="inline-tick inline-icon">
                <svg
                  width="10.79"
                  height="8.608"
                  viewBox="0 0 10.79 8.608"
                >
                  <path
                    d="M2.987 6.575L10.244 0l.546.532-7.803 8.076h-.26L0 4.788l.545-.546 2.442 2.333z"
                  />
                </svg>
              </span>
              <span>I&#39;m OK with that</span>
            </button>
            <a
              href="https://profile.theguardian.com/privacy-settings"
              data-link-name="first-pv-consent : to-prefs"
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
