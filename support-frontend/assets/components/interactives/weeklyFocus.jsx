// @flow

// ----- Imports ----- //

// $FlowIgnore - required for hooks
import React, { useState, useEffect } from 'react';
import { useSwipeable, RIGHT, LEFT } from 'react-swipeable';
import { ThemeProvider } from 'emotion-theming';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { Button, LinkButton, buttonReaderRevenue } from '@guardian/src-button';
import { SvgCross, SvgChevronLeftSingle, SvgChevronRightSingle } from '@guardian/src-icons';

const focusContainer = css`
  visibility: hidden;
  height: 0;
  opacity: 0;
  padding: ${space[4]}px;
  transition: opacity 0.5s ease-in-out;

  button {
    display: none;
  }
`;

const focusContainerVisible = css`
  visibility: visible;
  opacity: 1;
  height: auto;

  button {
    display: inline-flex;
  }
`;

const focusWithButtons = css`
  display: flex;
  align-items: center;
`;

const focusContents = css`
  padding: ${space[4]}px;
  height: 492px;
  width: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const focusImage = css`
  float: left;
  padding-right: ${space[2]}px;
`;

const closeButtonContainer = css`
  display: flex;
  justify-content: flex-end;
`;

const copyParagraph = css`
  :not(:last-of-type) {
    margin-bottom: ${space[4]}px;
  }
`;

const slideVisible = css`
  visibility: visible;
  opacity: 1;
  transition: all 0.2s ease-in-out;
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

const slideDirections: { [string]: string } = {
  left: slideOutLeft,
  right: slideOutRight,
};

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
      can keep up with the latest twists and turns here.
    </p>
  </>
);

const totalSlides = 2;

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
      }, 190);
    }
  }, [show]);

  return (
    <div css={[passedCss, isVisible ? '' : slideHidden]} {...props} onTransitionEnd={transitionEnd}>
      {children}
    </div>
  );
}

export default function WeeklyFocus({ image, onClose }: { image: string, onClose: () => void }) {
  const [slide, setSlide] = useState<number>(1);
  const [direction, setDirection] = useState<string>('');

  function goBack() {
    setDirection('right');
    setSlide((currentSlide) => {
      if (currentSlide > 1) {
        return currentSlide - 1;
      }
      return currentSlide;
    });
  }

  function goForwards() {
    setDirection('left');
    setSlide((currentSlide) => {
      if (currentSlide < totalSlides) {
        return currentSlide + 1;
      }
      return currentSlide;
    });
  }

  const handlers = useSwipeable({
    onSwiped: (event: any) => {
      console.log(event);
      if (event.dir && event.dir === LEFT) {
        goForwards();
      } else if (event.dir && event.dir === RIGHT) {
        goBack();
      }
    },
    trackMouse: true,
  });

  return (
    <section css={[focusContainer, image ? focusContainerVisible : '']}>
      <div css={closeButtonContainer}>
        <Button priority="tertiary" icon={<SvgCross />} hideLabel onClick={onClose}>Close</Button>
      </div>
      {image &&
        <div css={focusWithButtons}>
          <div>
            <Button priority="tertiary" icon={<SvgChevronLeftSingle />} hideLabel onClick={goBack}>Back</Button>
          </div>
          <div {...handlers} css={focusContents}>
            <Slide show={slide === 1} css={[slideVisible, slide === 1 ? '' : [slideInvisible, slideDirections[direction]]]}>
              <img css={focusImage} src={image} alt="Guardian Weekly cover" draggable={false} />
              {copy}
            </Slide>
            <Slide show={slide === 2} css={[slideVisible, slide === 2 ? '' : [slideInvisible, slideDirections[direction]]]}>
              <div>
                <ThemeProvider theme={buttonReaderRevenue}>
                  <LinkButton href="#subscribe">
                    Subscribe now
                  </LinkButton>
                </ThemeProvider>
              </div>
            </Slide>
          </div>
          <div>
            <Button priority="tertiary" icon={<SvgChevronRightSingle />} hideLabel onClick={goForwards}>Back</Button>
          </div>
        </div>
      }
    </section>
  );
}
