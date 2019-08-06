// @flow

import React from 'react';

import { storiesOf } from '@storybook/react';
import { withKnobs, radios } from '@storybook/addon-knobs';

import ProductPageHero from 'components/productPage/productPageHero/productPageHero';
import Content, { Divider, Outset, NarrowContent, Appearances } from 'components/content/content';
import Text, { LargeParagraph, SansParagraph } from 'components/text/text';

const stories = storiesOf('Layout', module)
  .addDecorator(withKnobs);

const appearanceKnob = () => radios('Appearance', Object.keys(Appearances), Object.keys(Appearances)[0]);
stories.add('Content', () => (
  <div>
    <Content
      appearance={appearanceKnob()}
    >
      <Text title="Meet Content, your base grid">
        <LargeParagraph>Wrap your content inside <code>Content</code> to have a grid basis</LargeParagraph>
        <Divider />
        <p>You can throw in multilines to break up pieces of text</p>
      </Text>
    </Content>
    <Content
      appearance="feature"
    >
      <Text>
        <LargeParagraph>
          Two pieces of content one after the other having the same appearance get a line between them
        </LargeParagraph>
        <SansParagraph>
          All <code>Text</code> elements automatically get a max-width applied to them
        </SansParagraph>
      </Text>
      <NarrowContent>
        You can wrap custom non-text elements that need the same max-width as
        the text in <code>NarrowContent</code>. It looks just like <code>Text</code> but
        semantics matter! Don{'\''}t wrap non text elements in <code>Text</code> just to get a max width
      </NarrowContent>
    </Content>
    <Content >
      <Text title="Feeling adventurous ?" />
      <Outset>
        <Text>
          {/* eslint-disable-next-line */}
          👉 use Outset to break out of the padding and go full bleed on the left, for stuff like tabs.
        </Text>
      </Outset>
      <div style={{ padding: '1em 0' }}>
        And you can add elements with no max-width rules
        by just placing them unwrapped. There{'\''}s still a
        max width at play here, but you don{'\''}t wanna go over it!!
      </div>
      <Divider />
      <Text title="What else to know?">
        <SansParagraph>
          The vertical rythm for the children of <code>Content</code> is
          defined ad-hoc inside its CSS (boo!).
        </SansParagraph>
        <SansParagraph>
          It normally does what you want it to do, as you{'\''}ll mostly use <code>Text</code>
          or a couple of bespoke containers like the forms. But you
          might need to add more special exceptions, go for it!
        </SansParagraph>
      </Text>
    </Content>
  </div>
));

stories.add('Hero', () => (
  <ProductPageHero
    overheading="This overheading is the H1"
    heading="This is a default banner lemon drizzle waffle confit"
    appearance="feature"
    content="Hero blocks showcase a product and really help set the mood of a page. They work great right under the header!"
    hasCampaign={false}
    showProductPageHeroHeader
  >
    <div />
  </ProductPageHero>
));

stories.add('Hero (campaign)', () => (
  <ProductPageHero
    overheading="This overheading is the H1"
    heading="This is a campign banner lemon drizzle waffle confit"
    appearance="campaign"
    content="Hero blocks showcase a product and really help set the mood of a page. They work great right under the header!"
    hasCampaign
    showProductPageHeroHeader
  >
    <div />
  </ProductPageHero>
));
