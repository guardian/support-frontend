// @flow

// ----- Imports ----- //
import React from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import Title from './components/title';
import WhySupport from './components/why-support';
import SvgChevronUp from 'components/svgs/chevronUp';
import CtaLink from 'components/ctaLink/ctaLink';

// ----- Page Startup ----- //

pageInit();

// ----- Render ----- //

const content = (
  <Page
    header={<SimpleHeader />}
    footer={<Footer />}
  >
    <Title />
    <WhySupport />
    <CtaLink
      text="See supporter options"
      url="#"
      accessibilityHint="See the options for becoming a supporter"
      svg={<SvgChevronUp />}
      modifierClasses={['see-supporter-options']}
    />
  </Page>
);

renderPage(content, 'support-landing-page-2');
