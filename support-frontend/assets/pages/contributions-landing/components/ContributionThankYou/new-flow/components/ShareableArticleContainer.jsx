// @flow
import React from 'react';
import { css } from '@emotion/core';
import { neutral, news } from '@guardian/src-foundations/palette';
import { LinkButton } from '@guardian/src-button';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {SvgFacebook, SvgTwitter, SvgEnvelope} from '@guardian/src-icons';
import SvgLinkedIn from '../components/SvgLinkedIn';
import styles from '../styles';
import {
  getFacebookShareLink,
  getTwitterShareLink,
  getLinkedInShareLink,
  getEmailShareLink,
} from '../../utils/social';
import {
  OPHAN_COMPONENT_ID_SOCIAL_FACEBOOK,
  OPHAN_COMPONENT_ID_SOCIAL_TWITTER,
  OPHAN_COMPONENT_ID_SOCIAL_LINKED_IN,
  OPHAN_COMPONENT_ID_SOCIAL_EMAIL,
} from '../../utils/ophan';
import { headline } from "@guardian/src-foundations/typography";
import { space } from "@guardian/src-foundations";

const container = css`
  display: flex;
  border-top: 1px solid ${news[400]};
  background-color: ${neutral[97]};
  position: relative;
  margin-top: ${space[6]}px;
`

const headlineText = css`
  ${headline.xxxsmall({ fontWeight: 'bold' })};
`;

const button = css`
  border: 1px solid ${neutral[86]};
  color: ${news[400]};
`

const img_container = css`
  padding: ${space[2]}px;
`

const img = css`
  width: 198px;
  height: 120px;
`

const headline_and_buttons_container = css`
  padding: ${space[2]}px;
`

type PropTypes = {
  articleUrl: String,
  headline: String,
  imageUrl: String,
  imageAltText: String
}

const ShareableArticleContainer = (props: PropTypes) => {
  return (
    <div css={container}>
      <div css={img_container}>
        <img css={img} src={props.imageUrl} alt={props.imageAltText} />
      </div>
      <div css={headline_and_buttons_container}>
        <h3 css={headlineText}>{props.headline}</h3>
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
            css={button}
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
            css={button}
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
            css={button}
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
            css={button}
            hideLabel
          />
        </div>
      </div>
    </div>
  )
}

export default ShareableArticleContainer;
