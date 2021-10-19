// ----- Imports ----- //
import React from "react";
import Page from "components/page/page";
import Header from "components/headers/header/header";
import Footer from "components/footer/footer";
import PageSection from "components/pageSection/pageSection";
import QuestionsContact from "components/questionsContact/questionsContact";
import { setUpTrackingAndConsents } from "helpers/page/page";
import { renderPage } from "helpers/rendering/render";
import { detect } from "helpers/internationalisation/countryGroup";
import { LinkButton } from "@guardian/src-button";
// ----- Page Startup ----- //
setUpTrackingAndConsents();
// ----- Render ----- //
const content = <Page header={<Header countryGroupId={detect()} />} footer={<Footer />}>
    <div className="paypal-error">
      <PageSection modifierClass="paypal-error">
        <h1 className="paypal-error__heading">Please try again</h1>
        <p className="paypal-error__copy">
          Sorry, we were unable to complete your payment the first time. Don’t
          worry, you haven’t been charged anything.
        </p>
        <LinkButton href="/contribute">Try again</LinkButton>
      </PageSection>
      <QuestionsContact />
    </div>
  </Page>;
renderPage(content, 'paypal-error-page');