// @flow

// ----- Imports ----- //

import React from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { Button } from '@guardian/src-button';
import { SvgCross } from '@guardian/src-icons';

const focusContainer = css`
  visibility: hidden;
  height: 0;
  opacity: 0;
  padding: ${space[4]}px;
  transition: opacity 0.5s ease-in-out;

  * {
    height: 0;
  }

  button {
    display: none;
  }
`;

const focusContainerVisible = css`
  visibility: visible;
  opacity: 1;
  height: auto;

  * {
    height: unset;
  }

  button {
    display: inline-flex;
  }
`;

const focusContents = css`
  display: flex;
  padding: ${space[4]}px;
`;

const closeButtonContainer = css`
  display: flex;
  justify-content: flex-end;
`;

const copyContainer = css`
  margin-left: ${space[4]}px;
`;

const copyParagraph = css`
  :not(:last-of-type) {
    margin-bottom: ${space[4]}px;
  }
`;

const copy = (
  <>
    <p css={copyParagraph}>
      No one with an attachment to the top end of professional football over the past few decades would have been
      shocked that 12 clubs were planning to create their own European Super League. But the news was serious enough
      that it led to an immediate – and furious – outcry. The reaction was so fierce that the six English clubs
      involved have already pulled out of the enterprise.
    </p>
    <p css={copyParagraph}>
      Unfortunately for us, their about-turn occurred several hours after we’d sent this week’s edition to the printers.
      Nevertheless, we feature stirring responses from Barney Ronay and Jonathan Liew to a move of almost unprecedented
      sporting greed.
    </p>
    <p css={copyParagraph}>
      Our award-winning sport team have also been live-blogging the Super League fallout since Monday morning and you
      can keep up with the latest twists and turns here,
    </p>
    <p css={copyParagraph}>
      The announcement of a guilty verdict in the trial of Derek Chauvin for the murder of George Floyd was also made
      on Tuesday evening. In this week’s issue, we headed to Minneapolis to witness a city on edge ahead of the jury’s
      decision. There is extensive coverage of the verdict at Guardian US.
    </p>
  </>
);


export default function WeeklyFocus({ image, onClose }: { image: string, onClose: () => void }) {
  return (
    <section css={[focusContainer, image ? focusContainerVisible : '']}>
      <div css={closeButtonContainer}>
        <Button priority="tertiary" icon={<SvgCross />} hideLabel onClick={onClose}>Close</Button>
      </div>
      <div css={focusContents}>
        <img src={image} alt="Guardian Weekly cover" />
        <div css={copyContainer}>
          {copy}
        </div>
      </div>
    </section>
  );
}
