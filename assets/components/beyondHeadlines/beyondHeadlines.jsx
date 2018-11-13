import React from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import SvgScribble from 'components/svgs/scribble';
import ProductPageTextBlock from 'components/productPage/productPageTextBlock/productPageTextBlock';

export default function BeyondHeadlines() {
  return (
    <ProductPageTextBlock title="Beyond the headlines">
      <p>
        We pride ourselves on our breaking news stories,
        in-depth analysis and thoughtful opinion pieces.
        But it's not just the news desk that works round the clock.
        Across the world, our sports writers, arts critics, interviewers
        and science reporters are dedicated to bringing you the quality
        coverage you have come to expect of the Guardian. Why settle for less?
      </p>
      <Heading>
        <SvgScribble isCirclesDesign={false}/>
      </Heading>
      <p>
        Our journalism is editorially independent, meaning we set our own agenda.
        No one edits our editor and no one steers our opinion.
        We are free from commercial bias and are not influenced by billionaire owners,
        politicians or shareholders. This independence matters because it enables us
        to challenge the powerful, and hold them to account.
      </p>
    </ProductPageTextBlock>
  )
}
