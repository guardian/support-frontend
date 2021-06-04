// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { titlepiece } from '@guardian/src-foundations/typography';
import { brandAlt, text } from '@guardian/src-foundations/palette';
import { digitalSubscriptionsBlue } from 'stylesheets/emotion/colours';
import FlexContainer from 'components/containers/flexContainer';
import Quote from 'components/quote/quote';

export const evContainerOverrides = css`
  background-color: ${digitalSubscriptionsBlue};
`;

const evQuoteContainer = css`
  ${from.desktop} {
    padding: ${space[9]}px 0;
  }
`;

const evHeadlineContainer = css`
  ${from.tablet} {
    min-width: 50%;
  }
`;

const evHeadline = css`
  ${titlepiece.medium({ fontWeight: 'bold' })};
  color: ${text.ctaPrimary};
  width: min-content;
`;

const evHeadlineYellow = css`
  color: ${brandAlt[400]};
`;

const evHeadlineBigText = css`
  display: inline-block;
  width: 100%;
  font-size: 92px;
  line-height: 0.9;
  vertical-align: super;
`;

const evHeadlineRightAlign = css`
  display: block;
  text-align: right;
`;

function EditorialVoice() {
  return (
    <FlexContainer cssOverrides={evQuoteContainer}>
      <div css={evHeadlineContainer}>
        <h2 css={evHeadline}>
          Why <span css={evHeadlineYellow}>your</span>{' '}
          <span css={[evHeadlineYellow, evHeadlineBigText]}>support</span>{' '}
          <span css={evHeadlineRightAlign}>matters</span>
        </h2>
      </div>
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
              investigate, explain, challenge, expose, amplify the voices that would otherwise be silenced.{' '}
          <strong>Together, we can make space for hope.</strong>
        </p>
      </Quote>
    </FlexContainer>
  );
}

export default EditorialVoice;
