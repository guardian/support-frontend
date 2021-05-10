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
  left: -1px;
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
  height: 316px;

  ${from.desktop} {
    height: 376px;
    margin-left: ${space[12]}px;
  }

  img {
    max-height: 100%;
  }
`;

const evQuotePadding = css`
  padding: ${space[4]}px;

  ${from.desktop} {
    padding-top: 56px;
    padding-left: 56px;
    padding-right: 80px;
  }
`;

function EditorialVoice() {
  return (
    <Block cssOverrides={blockOverrides}>
      <BlockLabel cssOverrides={evLabel}>Why your support matters</BlockLabel>
      <div css={evContainer}>
        <div css={evImageContainer}>
          <img src="https://media.guim.co.uk/fe925780346f02f20530eadc6890c40946c3c88b/0_0_137_376/137.png" alt="" />
        </div>
        <div css={evQuotePadding}>
          <Quote name="Damian Carrington" jobTitle="Environment Editor">
            <p>
              The biggest story of the 21st Century is the climate crisis; reporting on global,
              slow-motion disasters requires long-term commitment.{' '}
              <strong>The secure foundation Guardian subscribers provide is essential to us.</strong>
            </p>
          </Quote>
        </div>
      </div>
    </Block>
  );
}

export default EditorialVoice;
