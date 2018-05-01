// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import SquaresIntroduction from 'components/introduction/squaresIntroduction';
import PageSection from 'components/pageSection/pageSection';
import CtaLink from 'components/ctaLink/ctaLink';
import { contributionsEmail } from 'helpers/legal';


// ----- Types ----- //

type PropTypes = {
  errorCode: string,
  headings: string[],
  copy: string,
  reportLink?: boolean,
};


// ----- Component ----- //

export default function ErrorContent(props: PropTypes) {

  return (
    <div className="component-error-content gu-content">
      <SimpleHeader />
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
          ctaId="support-the-guardian"
          url="/"
        />
        <CtaLink
          text="Go to The Guardian home page"
          accessibilityHint="click here to return to The Guardian home page"
          ctaId="guardian-home-page"
          url="https://www.theguardian.com"
        />
      </PageSection>
      <Footer />
    </div>
  );

}


// ----- Auxiliary Components ----- //

function ReportLink(props: { show: boolean }) {

  if (props.show) {
    return (
      <span className="error-copy__text">
        please <a className="error-copy__link" href={contributionsEmail}>report it</a>.
      </span>
    );
  }

  return null;

}


// ----- Default Props ----- //

ErrorContent.defaultProps = {
  reportLink: false,
};
