// ----- Imports ----- //
import React from "react";
import { renderPage } from "helpers/rendering/render";
import { setUpTrackingAndConsents } from "helpers/page/page";
import Page from "components/page/page";
import Footer from "components/footerCompliant/Footer";
import Heading from "components/heading/heading";
import headerWithCountrySwitcherContainer from "components/headers/header/headerWithCountrySwitcher";
import type { CountryGroupId } from "helpers/internationalisation/countryGroup";
import { detect } from "helpers/internationalisation/countryGroup";
import { GBPCountries, AUDCountries, Canada, EURCountries, International, NZDCountries, UnitedStates } from "helpers/internationalisation/countryGroup";
import Content from "components/content/content";
import "stylesheets/skeleton/skeleton.scss";
import WhySupportMatters from "./components/whySupportMatters";
import BreakingHeadlines from "./components/breakingHeadlines";
import NoOneEdits from "./components/noOneEdits";
import Hero from "./components/hero";
import CtaSubscribe from "./components/ctaSubscribe";
import CtaContribute from "./components/ctaContribute";
import OtherProducts from "./components/otherProducts";
import "./showcase.scss";
// ----- Internationalisation ----- //
const countryGroupId: CountryGroupId = detect();
const CountrySwitcherHeader = headerWithCountrySwitcherContainer({
  path: '/support',
  countryGroupId,
  listOfCountryGroups: [GBPCountries, UnitedStates, AUDCountries, EURCountries, NZDCountries, Canada, International]
});

// ----- Render ----- //
const ShowcasePage = () => <Page header={<CountrySwitcherHeader />} footer={<Footer />}>
    <Hero countryGroupId={countryGroupId} />
    <WhySupportMatters />
    <BreakingHeadlines />
    <NoOneEdits />
    <Content id="support">
      <Heading size={2} className="anchor">
          Ways you can support the Guardian
      </Heading>
    </Content>
    <CtaSubscribe />
    <CtaContribute />
    {countryGroupId === 'GBPCountries' && <OtherProducts />}
  </Page>;

setUpTrackingAndConsents();
const content = <ShowcasePage />;
renderPage(content, 'showcase-landing-page');
export { content };