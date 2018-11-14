// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import SquaresIntroduction from 'components/introduction/squaresIntroduction';
import PageSection from 'components/pageSection/pageSection';
import CtaLink from 'components/ctaLink/ctaLink';
import { contributionsEmail } from 'helpers/legal';

import '../error.scss';

// ----- Types ----- //

type PropTypes = {|
  errorCode: string,
  headings: string[],
  copy: string,
  reportLink?: boolean,
|};


// ----- Component ----- //

export default function ErrorPage(props: PropTypes) {

  return (
    <Page
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <SquaresIntroduction
        headings={props.headings}
        highlights={[`Error ${props.errorCode}`]}
      />
      <PageSection modifierClass="ctas">
        <p className="error-copy">
          <span className="error-copy__text">{props.copy} </span>
          <ReportLink show={props.reportLink || false} />
        </p>
        <CtaLink
          text="Support The Guardian"
          accessibilityHint="click here to support The Guardian"
          url="/"
          modifierClasses={['support-the-guardian']}
        />
        <CtaLink
          text="Go to The Guardian home page"
          accessibilityHint="click here to return to The Guardian home page"
          url="https://www.theguardian.com"
          modifierClasses={['guardian-home-page', 'border']}
        />
      </PageSection>
    </Page>
  );

}


// ----- Auxiliary Components ----- //

function ReportLink(props: { show: boolean }) {

  if (props.show) {
    return (
      <span className="error-copy__text">
        please <a className="error-copy__link" href={contributionsEmail.GBPCountries}>report it</a>.
      </span>
    );
  }

  return null;

}


// ----- Default Props ----- //

ErrorPage.defaultProps = {
  reportLink: false,
};
