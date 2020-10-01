// @flow
import React from 'react';
import { css } from '@emotion/core';
import { neutral, news } from '@guardian/src-foundations/palette';
import { LinkButton } from '@guardian/src-button';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import {SvgFacebook, SvgTwitter, SvgEnvelope} from '@guardian/src-icons';
import SvgLinkedIn from '../components/SvgLinkedIn';
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
import { from, until } from "@guardian/src-foundations/mq";

// Styles ///////////////////////////////////////////////////////////

const outerContainer = css`
  display: flex;
  flex-direction: column;
  margin-top: ${space[6]}px;
`

const innerContainer = css`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${news[400]};
  background-color: ${neutral[97]};
`

const buttonsContainer = css`
  margin-top: ${space[4]}px;
  margin-left: ${space[2]}px;
  display: block;

  & > * {
    margin-bottom: ${space[2]}px;
    margin-right: ${space[2]}px;
  }

  ${until.phablet} {
    display: none;
  }
`

const headlineText = css`
  text-decoration: none;
  cursor: pointer;
  color: ${neutral[7]};
  ${headline.xxxsmall({ lineHeight: 'tight' })};
  font-weight: 600 !important;

  ${until.phablet} {
    font-size: 15px !important;
  }
`;

const button = css`
  border: 1px solid ${neutral[86]};
  color: ${news[400]};
`

const imageContainer = css`
  max-width: 45%;
  padding: ${space[2]}px;
`

const image = css`
  width: 100% !important;
  width: 100% !important;
`

const headlineAndButtonsContainer = css`
  padding: ${space[2]}px ${space[2]}px ${space[2]}px 0;
`

const compactShareButtonContainer = css`
  display: block;
  margin-top: ${space[2]}px;

  ${from.phablet} {
    display: none;
  }
`

// Types ////////////////////////////////////////////////////////////

type PropTypes = {
  articleUrl: String,
  headline: String,
  imageUrl: String,
  imageAltText: String
}

// Component ////////////////////////////////////////////////////////

const ShareableArticleContainer = (props: PropTypes) => {
  return (
    <div css={outerContainer}>
      <div css={innerContainer}>
        <div css={imageContainer}>
          <img css={image} src={props.imageUrl} alt={props.imageAltText} />
        </div>
        <div css={headlineAndButtonsContainer}>
          <a
            href={props.articleUrl}
            css={headlineText}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.headline}
          </a>
          <div css={buttonsContainer}>
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
      <div css={compactShareButtonContainer}>
        <LinkButton
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          priority="secondary"
          size="small"
        >
          Share
        </LinkButton>
      </div>
    </div>
  )
}

export default ShareableArticleContainer;
