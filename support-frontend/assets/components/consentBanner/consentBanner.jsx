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
import Button from 'components/button/button';
import Text from 'components/text/text';
import styles from 'components/consentBanner/consentBanner.module.scss';
import { get as getCookie } from '../../helpers/cookie';

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
  const showBanner = props.trackingConsent === Unset && getCookie('_post_deploy_user') !== 'true';
  if (showBanner) {
    return (
      <div className={styles.root}>
        <div className={styles.copy}>
          <Roundel className={styles.roundel} />
          <Text className={styles.text} title="Your privacy">
            <p>We use cookies to improve your experience on our site and to show you personalised advertising.</p>
            <p>To find out more, read our&nbsp;
              <a
                href="https://www.theguardian.com/help/privacy-policy"
              >
                privacy policy
              </a>&nbsp;and&nbsp;
              <a
                href="https://www.theguardian.com/info/cookies"
              >
                cookie policy
              </a>.
            </p>
          </Text>
          <div className={styles.actions}>
            <Button aria-label={null} icon={<Tick />} iconSide="left" onClick={props.onAccepted}>
              I&#39;m OK with that
            </Button>
            <a
              href="https://profile.theguardian.com/privacy-settings"
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
