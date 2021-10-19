// ----- Imports ----- //
import React from "react";
import Page from "components/page/page";
import Header from "components/headers/header/header";
import Footer from "components/footerCompliant/Footer";
import SquaresIntroduction from "components/introduction/squaresIntroduction";
import PageSection from "components/pageSection/pageSection";
import Rows from "components/base/rows";
import AnchorButton from "components/button/anchorButton";
import { contributionsEmail } from "helpers/legal";
import Text, { LargeParagraph } from "components/text/text";
import "../error.scss";
import { detect } from "helpers/internationalisation/countryGroup";
// ----- Types ----- //
type PropTypes = {
  errorCode?: string;
  headings: string[];
  copy: string;
  reportLink?: boolean;
}; // ----- Component ----- //

export default function ErrorPage(props: PropTypes) {
  return <Page header={<Header countryGroupId={detect()} />} footer={<Footer />}>
      <SquaresIntroduction headings={props.headings} highlights={props.errorCode ? [`Error ${props.errorCode}`] : []} />
      <PageSection>
        <Text>
          <LargeParagraph>
            <span className="error-copy__text">{props.copy} </span>
            <ReportLink show={props.reportLink || false} />
          </LargeParagraph>
          <Rows>
            <AnchorButton aria-label="click here to support the Guardian" href="/" modifierClasses={['support-the-guardian']}>
              Support the Guardian
            </AnchorButton>
            <br />
            <AnchorButton aria-label="click here to return to the Guardian home page" href="https://www.theguardian.com" appearance="greyHollow">
              Go to the Guardian home page
            </AnchorButton>
          </Rows>
        </Text>
      </PageSection>
    </Page>;
} // ----- Auxiliary Components ----- //

function ReportLink(props: {
  show: boolean;
}) {
  if (props.show) {
    return <span className="error-copy__text">
        please <a className="error-copy__link" href={contributionsEmail.GBPCountries}>report it</a>.
      </span>;
  }

  return null;
}

// ----- Default Props ----- //
ErrorPage.defaultProps = {
  reportLink: false,
  errorCode: null
};