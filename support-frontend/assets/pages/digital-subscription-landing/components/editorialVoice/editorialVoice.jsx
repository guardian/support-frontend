// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from, until } from '@guardian/src-foundations/mq';

import Block from 'components/page/block';
import Quote from 'components/quote/quote';
import BlockLabel from 'components/blockLabel/blockLabel';

const blockOverrides = css`
  margin-top: 52px;

  ${from.desktop} {
    margin-top: 66px;
  }
`;

const evLabel = css`
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%);
`;

const evQuoteContainer = css`
  ${until.tablet} {
    margin: -${space[5]}px ${space[4]}px 0;
  }
`;

function EditorialVoice() {
  return (
    <Block cssOverrides={blockOverrides}>
      <BlockLabel tag="h2" cssOverrides={evLabel}>Why your support matters</BlockLabel>
      <div css={evQuoteContainer}>
        <Quote
          name="Katharine Viner"
          jobTitle="Editor-in-chief"
          headshot={
          // No alt text needed- the preceeding name/job title describe the image
            <img src="https://media.guim.co.uk/1e8cd6f3fc9af8ba9f84a4f70acc381ca9bf0fb3/0_0_315_315/140.png" alt="" />
          }
        >
          <p>
            <strong>Thank you for joining us. Your funding helps us to do what we do best:</strong>{' '}
              investigate, explain, challenge, expose, amplify the voices that would otherwise be silenced.{' '}
            <strong>Together, we can make space for hope.</strong>
          </p>
        </Quote>
      </div>
    </Block>
  );
}

export default EditorialVoice;
