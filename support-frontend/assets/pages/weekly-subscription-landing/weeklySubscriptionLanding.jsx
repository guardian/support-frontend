// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import Footer from 'components/footer/footer';

import {
  AUDCountries,
  Canada,
  type CountryGroupId,
  countryGroups,
  detect,
  EURCountries,
  GBPCountries,
  International,
  NZDCountries,
  UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import Content, { Outset } from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import ProductPageFeatures
  from 'components/productPage/productPageFeatures/productPageFeatures';
import ProductPageInfoChip
  from 'components/productPage/productPageInfoChip/productPageInfoChip';
import SvgInformation from 'components/svgs/information';
import SvgGift from 'components/svgs/gift';
import 'stylesheets/skeleton/skeleton.scss';

import { CampaignHeader } from './components/hero/hero';

import WeeklyForm from './components/weeklyForm';
import reducer from './weeklySubscriptionLandingReducer';
import ConsentBanner from 'components/consentBanner/consentBanner';

import './weeklySubscriptionLanding.scss';

// ----- Redux Store ----- //

const store = pageInit(() => reducer, true);

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();
const { supportInternationalisationId } = countryGroups[countryGroupId];
const subsCountry = (['us', 'au'].includes(supportInternationalisationId) ? supportInternationalisationId : 'gb').toUpperCase();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'weekly-landing-page-uk',
  UnitedStates: 'weekly-landing-page-us',
  AUDCountries: 'weekly-landing-page-au',
  NZDCountries: 'weekly-landing-page-nz',
  EURCountries: 'weekly-landing-page-eu',
  Canada: 'weekly-landing-page-ca',
  International: 'weekly-landing-page-int',
};


const Header = headerWithCountrySwitcherContainer({
  path: '/subscribe/weekly',
  countryGroupId,
  listOfCountries: [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    Canada,
    NZDCountries,
    International,
  ],
  trackProduct: 'GuardianWeekly',
});

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<Header />}
      footer={<Footer />}
    >
      <CampaignHeader />
      <Content>
        <Text title="Open up your world view, Weekly">
          <LargeParagraph>Inside the essential magazine from
          The&nbsp;Guardian, you&rsquo;ll find expert opinion, insight and culture, curated to
          bring you a progressive, international perspective. You&rsquo;ll also discover
          challenging new puzzles every week. Subscribe today and get free delivery, worldwide.
          </LargeParagraph>
        </Text>
      </Content>
      <Content id="benefits">
        <Text title="As a subscriber you’ll enjoy" />
        <Outset>
          <ProductPageFeatures features={[
            { title: 'Up to 35% off the retail cover price' },
            { title: 'Free international shipping' },
            { title: 'A weekly email newsletter from the editor' },
            { title: 'Access to every edition on any device, through PressReader' },
          ]}
          />
        </Outset>
      </Content>
      <Content appearance="feature" id="subscribe">
        <Text title="Subscribe to Guardian Weekly today">
          <p>Choose how you’d like to pay</p>
        </Text>
        <WeeklyForm />
        <ProductPageInfoChip icon={<SvgGift />}>
              Gifting is available
        </ProductPageInfoChip>
        <ProductPageInfoChip icon={<SvgInformation />}>
              You can cancel your subscription at any time
        </ProductPageInfoChip>
      </Content>
      <Content>
        <Text title="Gift subscriptions">
          <LargeParagraph>A Guardian Weekly subscription makes a great gift.
            To&nbsp;buy&nbsp;one, just select the gift option at checkout or get in touch with your local customer
            service team:
          </LargeParagraph>
        </Text>
        <Outset>
          <ProductPageFeatures features={[
            { title: 'UK, Europe and Rest of World', copy: '+44 (0) 330 333 6767' },
            { title: 'Australia and New Zealand', copy: '+61 2 8076 8599' },
            { title: 'USA and Canada', copy: '+1 917-900-4663' },
          ]}
          />
        </Outset>
      </Content>
      <Content>
        <Text title="Promotion terms and conditions">
          <p>Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. For full annual promotion terms and conditions, see <a target="_blank" rel="noopener noreferrer" href={`https://subscribe.theguardian.com/p/10ANNUAL/terms?country=${subsCountry}`}>here</a>.
          </p>
        </Text>
        <Text title="Guardian Weekly terms and conditions">
          <p>Subscriptions available to people aged 18 and over with a valid email address. For full details of Guardian Weekly print subscription services and their terms and conditions, see <a target="_blank" rel="noopener noreferrer" href="https://subscribe.theguardian.com/p/10ANNUAL/terms">here</a>.
          </p>
        </Text>
      </Content>
      <ConsentBanner />
    </Page>
  </Provider>
);

renderPage(content, reactElementId[countryGroupId]);
