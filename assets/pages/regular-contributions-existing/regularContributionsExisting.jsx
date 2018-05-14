// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import ManageContributionCta from 'components/manageContributionCta/manageContributionCta';
import QuestionsContact from 'components/questionsContact/questionsContact';

import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import CirclesIntroduction from '../../components/introduction/circlesIntroduction';
import PageSection from '../../components/pageSection/pageSection';


// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <div className="gu-content">
    <SimpleHeader />
    <CirclesIntroduction
      headings={['Whoops!']}
    />
    <PageSection modifierClass="existing-contribution">
      <p className="existing-contribition-copy">
          Looks like you are already making a regular contribution to the
          Guardian - thank you. If you&#39;re feeling generous, there is
          another way you can&nbsp;help.
      </p>
      <ManageContributionCta />
    </PageSection >
    <QuestionsContact />
    <Footer />
  </div>
);

renderPage(content, 'regular-contributions-existing-page');
