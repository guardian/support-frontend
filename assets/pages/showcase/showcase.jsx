// @flow

// ----- Imports ----- //
import React from 'react';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import Heading from 'components/heading/heading';

import ProductPageHero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import UiButton from 'components/ui/uiButton/uiButton';

import SvgChevron from 'components/svgs/chevron';
import GridPicture from 'components/gridPicture/gridPicture';

import WhySupportMatters from './components/whySupportMatters';
import BreakingHeadlines from './components/breakingHeadlines';
import NoOneEdits from './components/noOneEdits';
import CtaSubscribe from './components/ctaSubscribe';
import CtaContribute from './components/ctaContribute';
import OtherProducts from './components/otherProducts';

import './showcase.scss';

// ----- Page Startup ----- //

pageInit();

// ----- Render ----- //

const content = (
  <Page
    header={<SimpleHeader />}
    footer={<Footer />}
  >
    <ProductPageHero
      overheading="Support The Guardian"
      heading="Help us deliver independent investigative journalism"
      type="feature"
      cta={<UiButton icon={<SvgChevron />} href="#support">Ways to support</UiButton>}
    >
      <GridPicture
        sources={[
          {
            gridId: 'showcase',
            srcSizes: [500, 1000],
            imgType: 'png',
            sizes: '100vw',
            media: '(max-width: 739px)',
          },
          {
            gridId: 'showcase',
            srcSizes: [1000, 2000],
            imgType: 'png',
            sizes: '(min-width: 1000px) 2000px, 1000px',
            media: '(min-width: 740px)',
          },
        ]}
        fallback="showcase"
        fallbackSize={1000}
        altText=""
        fallbackImgType="png"
      />
    </ProductPageHero>
    <WhySupportMatters />
    <BreakingHeadlines />
    <NoOneEdits />
    <ProductPageContentBlock id="support">
      <Heading size={2} className="anchor">
        Ways you can support The Guardian
      </Heading>
    </ProductPageContentBlock>
    <CtaSubscribe />
    <CtaContribute />
    <OtherProducts />
  </Page>
);

renderPage(content, 'showcase-landing-page');
