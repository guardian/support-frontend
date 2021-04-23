/* eslint-disable max-len */
// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { from, until } from '@guardian/src-foundations/mq';
import { Button } from '@guardian/src-button';
import { SvgCross, SvgChevronLeftSingle, SvgChevronRightSingle } from '@guardian/src-icons';

const hideOnMobile = css`
  ${until.desktop} {
    display: none;
  }
`;

const hideOnDesktop = css`
  ${from.desktop} {
    display: none;
  }
`;

const focusContainer = css`
  visibility: hidden;
  height: 0;
  width: 0;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  ${from.desktop} {
    padding: ${space[4]}px;
  }

  button {
    display: none;
  }
`;

const focusContainerVisible = css`
  visibility: visible;
  opacity: 1;
  height: 100%;
  width: 100%;

  ${until.desktop} {
    width: 100vw;
  }

  button {
    display: inline-flex;
  }
`;

const focusWithButtons = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const focusContents = css`
  margin-top: ${space[2]}px;
  height: 100%;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 2;

  ${from.desktop} {
    padding: ${space[4]}px;
    height: 600px;
  }

  ${until.desktop} {
    width: 100vw;
  }
`;

const focusImage = css`
  max-height: 100%;

  ${until.desktop} {
    height: 400px;
    padding-left: ${space[2]}px;
  }

  ${from.desktop} {
    width: 400px;
    padding-right: ${space[2]}px;
  }
`;

const spreadImage = css`
  height: 513px;
`;

const focusImageContainer = css`
  height: 100%;
  width: 100%;

  ${until.desktop} {
    padding-bottom: ${space[2]}px;
    width: 100vw;
    max-height: 400px;
    overflow-x: scroll;
    overflow-y: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE 10+ */

    ::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* Chrome/Safari/Webkit */
    }
  }

  ${from.desktop} {
    flex: 2;
    padding: 0 60px;
  }
`;

const closeButtonContainer = css`
  display: flex;
  justify-content: flex-end;

  ${until.desktop} {
    padding: 0 ${space[2]}px;
    justify-content: space-between;
  }
`;

const copyParagraph = css`
  margin-bottom: ${space[4]}px;
  ${until.desktop} {
    padding: 0 ${space[6]}px;

    :first-of-type {
      margin-top: 80px;
    }
  }

  ${from.desktop} {
    margin: 0;
    :not(:last-of-type) {
      margin-bottom: ${space[4]}px;
    }
  }
`;

const copyParagraphs = css`
  ${from.desktop} {
    padding: 60px;
  }
`;

const imageSlide = css`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 0 ${space[2]}px;

  ${from.desktop} {
    height: 100%;
    flex-direction: row;
    padding: 0;
  }
`;

const ctaSlide = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const slideVisible = css`
  visibility: visible;
  opacity: 1;
  transition: all 0.2s ease-in-out;
  /* max-height: 100vh; */
  height: 100%;
`;

const slideInvisible = css`
  visibility: hidden;
  opacity: 0;
`;

const slideHidden = css`
  &, * {
    display: none !important;
  }
`;

const slideOutLeft = css`
  transform: translateX(-50%);
`;

const slideOutRight = css`
  transform: translateX(50%);
`;

const fakePagination = css`
  content: ' ';
  display: inline-block;
  margin-right: ${space[1]}px;
  width: ${space[3]}px;
  height: ${space[3]}px;
  border-radius: 50%;
  background-color: #c4c4c4;
`;

const slideDirections: { [string]: string } = {
  left: slideOutLeft,
  right: slideOutRight,
};

const copy = (
  <div css={[copyParagraphs, hideOnMobile]}>
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
  </div>
);

const copyMob = (
  <div css={[copyParagraphs, hideOnDesktop]}>
    <p css={copyParagraph}>
      It would be easy to dismiss the fallout between the royal family and the Duke and Duchess of Sussex as nothingmore
      than a soap opera. But the royal family remains – despite its frequent crises and dramas – at the centre of Britain’s
      idea of itself. The accusations by Meghan and Harry of racism and mistreatment have ignited a global debate and shone
      a light on the reality of how multicultural modern Britain really is. As the fallout from the Sussexes’ incendiary
      interview continues, Zoe Williams asks how anyone can stand to be part of the royal circus, while historian David Olusoga
      wonders why the UK found it so hard to live up to an image of multiculturalism. Finally, Aamna Mohdin talks to black
      British women about what the treatment of Meghan by the press and the royals means to them.
    </p>
    <p css={copyParagraph}>
      Meanwhile in Hong Kong, the last vestiges of resistance against Beijing control have been slowly defeated. Last week
      saw many of the pro-democracy politicians and activists who were rounded up at the end of February charged and facing
      lengthy jail terms. It marks the culmination of the crackdown against the protests that began in 2019 with the
      introduction of a bill that would allow extradition to the mainland and signals an end to democracy in the city.
    </p>
  </div>
);

function Slide({
  css: passedCss, children, show, ...props
}: any) {
  const [isVisible, setIsVisible] = useState<boolean>(show || false);

  function transitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'opacity' && !show) {
      setIsVisible(current => !current);
    }
  }

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setIsVisible(show);
      }, 200);
    }
  }, [show]);

  return (
    <div css={[passedCss, isVisible ? '' : slideHidden]} {...props} onTransitionEnd={transitionEnd}>
      {children}
    </div>
  );
}

const totalSlides = 4;

export default function WeeklyFocus({ image, onClose }: { image: string, onClose: () => void }) {
  const [slide, setSlide] = useState<number>(1);
  const [direction, setDirection] = useState<string>('');

  function goBack() {
    setDirection('right');
    setSlide((currentSlide) => {
      if (currentSlide > 1) {
        return currentSlide - 1;
      }
      return totalSlides;
    });
  }

  function goForwards() {
    setDirection('left');
    setSlide((currentSlide) => {
      if (currentSlide < totalSlides) {
        return currentSlide + 1;
      }
      return 1;
    });
  }

  useEffect(() => {
    setSlide(1);
  }, [image]);

  return (
    <section css={[focusContainer, image ? focusContainerVisible : '']}>
      <div css={closeButtonContainer}>
        <div css={hideOnDesktop}>
          {Array.from({ length: 4 }).map(() => <span css={fakePagination} />)}
        </div>
        <Button priority="tertiary" icon={<SvgCross />} onClick={onClose} size="small" hideLabel>Close</Button>
      </div>
      {image &&
        <div css={focusWithButtons}>
          <div css={hideOnMobile}>
            <Button priority="tertiary" icon={<SvgChevronLeftSingle />} onClick={goBack} hideLabel>Back</Button>
          </div>
          <div css={focusContents}>
            <Slide show={slide === 1} css={[slideVisible, slide === 1 ? '' : [slideInvisible, slideDirections[direction]]]}>
              <div css={imageSlide}>
                <div css={focusImageContainer}>
                  <img height="513" css={focusImage} src={image} alt="Guardian Weekly cover" draggable={false} />
                </div>
                {copy}
                {copyMob}
              </div>
            </Slide>
            <Slide show={slide === 2} css={[slideVisible, slide === 2 ? '' : [slideInvisible, slideDirections[direction]]]}>
              <div css={ctaSlide}>
                <img height="513" css={spreadImage} src="https://support.thegulocal.com/assets/gwSpreads/GW%201 spread 1.png" alt="Guardian Weekly spread" draggable={false} />
              </div>
            </Slide>
            <Slide show={slide === 3} css={[slideVisible, slide === 3 ? '' : [slideInvisible, slideDirections[direction]]]}>
              <div css={ctaSlide}>
                <img height="513" css={spreadImage} src="https://support.thegulocal.com/assets/gwSpreads/GW%201 spread 2.png" alt="Guardian Weekly spread" draggable={false} />
              </div>
            </Slide>
            <Slide show={slide === 4} css={[slideVisible, slide === 4 ? '' : [slideInvisible, slideDirections[direction]]]}>
              <div css={ctaSlide}>
                <img height="513" css={spreadImage} src="https://support.thegulocal.com/assets/gwSpreads/GW%201 spread 3.png" alt="Guardian Weekly spread" draggable={false} />
              </div>
            </Slide>
          </div>
          <div css={hideOnMobile}>
            <Button priority="tertiary" icon={<SvgChevronRightSingle />} onClick={goForwards} hideLabel>Forward</Button>
          </div>
        </div>
      }
    </section>
  );
}
