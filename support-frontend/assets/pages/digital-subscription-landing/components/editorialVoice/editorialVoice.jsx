// @flow

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';

import Block from 'components/page/block';
import Quote from 'components/quote/quote';
import BlockLabel from 'components/blockLabel/blockLabel';

const blockOverrides = css`
  position: relative;
  padding: 0 !important;
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

const evContainer = css`
  display: flex;
  align-items: flex-start;
`;

const evImageContainer = css`
  display: flex;
  align-items: flex-start;
  margin-left: -${space[9]}px;
  height: 376px;
  flex-basis: auto;
  flex-shrink: 2;

  ${from.desktop} {
    margin-left: ${space[12]}px;
  }

  img {
    max-height: 100%;
  }
`;

const evQuotePadding = css`
  padding: ${space[2]}px;
  flex-shrink: 1;

  ${from.mobileMedium} {
    padding: ${space[4]}px;
  }

  ${from.phablet} {
    padding: ${space[6]}px;
  }

  ${from.desktop} {
    padding: ${space[9]}px;
  }

  ${from.leftCol} {
    padding-top: 56px;
    padding-left: 56px;
    padding-right: 80px;
  }
`;

function EditorialVoice() {
  return (
    <Block cssOverrides={blockOverrides}>
      <BlockLabel tag="h2" cssOverrides={evLabel}>Why your support matters</BlockLabel>
      <div css={evContainer}>
        <div css={evImageContainer}>
          <img
            src="https://media.guim.co.uk/fe925780346f02f20530eadc6890c40946c3c88b/0_0_137_376/137.png"
            alt="A stylised pen with a globe on its nib"
          />
        </div>
        <div css={evQuotePadding}>
          <Quote
            name="Damian Carrington"
            jobTitle="Environment Editor"
            headshot={
              // No alt text needed- the preceeding name/job title describe the image
              <img src="https://media.guim.co.uk/5218e86aa3406dd4b5a9b54a3147de4a2f411b17/0_1_315_315/140.png" alt="" />
            }
          >
            <p>
              The biggest story of the 21st century is the climate emergency.{' '}
              <strong>
                Our long-term commitment to reporting on the environmental crises is impossible without the secure
                foundation of support from our subscribers.
              </strong>
            </p>
          </Quote>
        </div>
      </div>
    </Block>
  );
}

export default EditorialVoice;
