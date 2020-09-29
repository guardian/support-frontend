// @flow
import React from 'react';
import { LinkButton } from '@guardian/src-button';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {SvgFacebook, SvgTwitter, SvgEnvelope} from '@guardian/src-icons';
import SvgLinkedIn from './components/SvgLinkedIn';
import styles from './styles';
import {
  getFacebookShareLink,
  getTwitterShareLink,
  getLinkedInShareLink,
  getEmailShareLink,
} from '../utils/social';
import {
  OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK,
  OPHAN_COMPONENT_ID_SOCIAL_TWITTER,
  OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN,
  OPHAN_COMPONENT_ID_SOCIAL_EMAIL,
} from '../utils/ophan';

type PropTypes = {
  articleURL: String,
  headline: String,
  linkedImageUrl:String
}

const ShareableArticleContainer = (props: PropTypes) => {
  return (
    <div css={styles.buttonsContainer}>
      <LinkButton
        href={getFacebookShareLink(props.referralCode)}
        onClick={() =>
          trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK)
        }
        target="_blank"
        rel="noopener noreferrer"
        priority="tertiary"
        size="default"
        icon={<SvgFacebook/>}
        hideLabel
      />
      <LinkButton
        href={getTwitterShareLink(props.referralCode)}
        onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_TWITTER)}
        target="_blank"
        rel="noopener noreferrer"
        priority="tertiary"
        size="default"
        icon={<SvgTwitter/>}
        hideLabel
      />
      <LinkButton
        href={getLinkedInShareLink(props.referralCode)}
        onClick={() =>
          trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN)
        }
        target="_blank"
        rel="noopener noreferrer"
        priority="tertiary"
        size="default"
        icon={<SvgLinkedIn/>}
        hideLabel
      />
      <LinkButton
        href={getEmailShareLink(props.referralCode)}
        onClick={() => trackComponentClick(OPHAN_COMPONENT_ID_SOCIAL_EMAIL)}
        target="_blank"
        rel="noopener noreferrer"
        priority="tertiary"
        size="default"
        icon={<SvgEnvelope/>}
        hideLabel
      />
    </div>
  )
}

export default ShareableArticleContainer;
