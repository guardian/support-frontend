// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { digitalSubscriptionsBlue } from 'stylesheets/emotion/colours';
import FlexContainer from 'components/containers/flexContainer';
import Quote from 'components/quote/quote';

import HeadlineSvg from './whyYourSupportMatters.svg';

export const evContainerOverrides = css`
  margin-bottom: ${space[6]}px;
  z-index: 1;
  background-color: ${digitalSubscriptionsBlue};
`;

const evFlexContainer = css`
  justify-content: space-between;
  padding: ${space[3]}px;

  ${from.tablet} {
    align-items: center;
    padding: ${space[9]}px ${space[3]}px;
  }

  ${from.desktop} {
    padding: ${space[9]}px 0;
  }
`;

const evHeadlineContainer = css`
  padding-bottom: ${space[3]}px;

  ${from.tablet} {
    padding-bottom: 0;
    padding-right: ${space[9]}px;
  }

  svg {
    width: 350px;
    max-width: 100%;
  }
`;

const visuallyHidden = css`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px !important;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  width: 1px;
`;

const evQuoteContainer = css`
  ${from.tablet} {
    max-width: 50%;
  }
`;

function EditorialVoice() {
  return (
    <FlexContainer cssOverrides={evFlexContainer}>
      <div css={evHeadlineContainer}>
        <h2 css={visuallyHidden}>
          Why your support matters
        </h2>
        <HeadlineSvg />
      </div>
      <div css={evQuoteContainer}>
        <Quote
          name="Katharine Viner"
          jobTitle="Editor-in-chief"
          headshot={
          // No alt text needed- the accompanying name/job title describe the image
            <img src="https://media.guim.co.uk/1e8cd6f3fc9af8ba9f84a4f70acc381ca9bf0fb3/0_0_315_315/140.png" alt="" />
          }
        >
          <p>
            <strong>Your funding helps us to do what we do best:</strong>{' '}
              investigate, explain, challenge, expose, amplify the voices that would otherwise be silenced.
            <strong> Together, we can make space for hope.</strong>
          </p>
        </Quote>
      </div>
    </FlexContainer>
  );
}

export default EditorialVoice;
