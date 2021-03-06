// @flow

// ----- Imports ----- //

import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { LinkButton, buttonBrand } from '@guardian/src-button';
import { SvgArrowDownStraight } from '@guardian/src-icons';
import CentredContainer from 'components/containers/centredContainer';
import GridImage from 'components/gridImage/gridImage';
import PageTitle from 'components/page/pageTitle';
import Hero from 'components/page/hero';
import GiftHeadingAnimation from 'components/animations/giftHeadingAnimation';

import {
  AUDCountries,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { promotionHTML, type PromotionCopy } from 'helpers/productPrice/promotions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import {
  heroCopy,
  paragraphs,
  mobileLineBreak,
} from './heroWithImageStyles';

type PropTypes = {
  promotionCopy: PromotionCopy,
  countryGroupId: CountryGroupId,
}

const GiftCopy = () => (
  <p>
    <strong>Share what matters most,<br css={mobileLineBreak} /> even when apart</strong><br />
    Show that you care with the gift of a digital gift subscription. Your loved ones will get the
    richest, ad-free experience of our independent journalism and your gift will help fund our work.
  </p>
);

function HeroWithImage({
  promotionCopy, countryGroupId,
}: PropTypes) {
  const promoCopy = promotionHTML(promotionCopy.description, { tag: 'div' });
  const copy = promoCopy || <GiftCopy />;

  return (
    <PageTitle
      title="Give the digital subscription"
      theme="digital"
    >
      <CentredContainer>
        <Hero
          image={<GridImage
            gridId={countryGroupId === AUDCountries ? 'editionsPackshotAus' : 'editionsPackshot'}
            srcSizes={[1000, 500, 140]}
            sizes="(max-width: 480px) 200px,
                (max-width: 740px) 100%,
                (max-width: 1067px) 150%,
                500px"
            altText="Digital subscriptions"
            imgType="png"
          />
          }
        >
          <section css={heroCopy}>
            <GiftHeadingAnimation />
            <div css={paragraphs}>
              {copy}
            </div>
            <div>
              <ThemeProvider theme={buttonBrand}>
                <LinkButton
                  href="#subscribe"
                  priority="tertiary"
                  size="default"
                  icon={<SvgArrowDownStraight />}
                  iconSide="right"
                  onClick={() => {
                      sendTrackingEventsOnClick({
                        id: 'options_cta_click',
                        product: 'DigitalPack',
                        componentType: 'ACQUISITIONS_BUTTON',
                      })();
                  }}
                >
                    See pricing options
                </LinkButton>
              </ThemeProvider>
            </div>
          </section>
        </Hero>
      </CentredContainer>
    </PageTitle>
  );
}

export { HeroWithImage };
