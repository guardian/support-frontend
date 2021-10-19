// ----- Imports ----- //
import React from "react";
import FlexContainer from "components/containers/flexContainer";
import GridImage from "components/gridImage/gridImage";
import LinkTo from "./linkTo";
import { Collection } from "helpers/productPrice/fulfilmentOptions";
import { Accordion } from "@guardian/src-accordion";
import { css } from "@emotion/core";
import { neutral } from "@guardian/src-foundations/palette";
import { textSans } from "@guardian/src-foundations/typography";
import { space } from "@guardian/src-foundations";
import { from, until } from "@guardian/src-foundations/mq";
import { TabAccordionRow } from "./tabAccordionRow";
import type { PaperFulfilmentOptions } from "helpers/productPrice/fulfilmentOptions";
const flexContainerOverride = css`
  align-items: flex-start;
  justify-content: space-between;

  img {
    ${until.leftCol} {
      display: none;
    }
  }
`;
const faqsContainer = css`
  ${from.leftCol} {
    max-width: 50%;
  }
`;
const paragraph = css`
  margin-bottom: ${space[6]}px;
  ${until.tablet} {
    padding: 0 ${space[2]}px;
  }

  a {
    color: inherit;
  }
`;
export const accordionContainer = css`
  background-color: ${neutral['97']};

  p, a {
    ${textSans.small()};
    margin-bottom: ${space[3]}px;
  }

  p, button {
    padding-right: ${space[2]}px;
    padding-left: ${space[2]}px;
  }
`;
// ----- Content ----- //
const accordionTrackingId = 'Paper_HomeDelivery-tab_Delivery-accordion';
export const ContentDeliveryFaqBlock = ({
  setTabAction
}: {
  setTabAction: (arg0: PaperFulfilmentOptions) => void;
}) => <FlexContainer cssOverrides={flexContainerOverride}>
    <div css={faqsContainer}>
      <p css={paragraph}>
        If you live in Greater London (within the M25), you can use the Guardian’s home delivery
        service. If not, you can use our{' '}
        <LinkTo tab={Collection} setTabAction={setTabAction}>subscription cards</LinkTo>.
      </p>
      <p css={paragraph}>
        Select your subscription below and checkout. You&apos;ll receive your first newspaper
        as quickly as five days from subscribing.
      </p>
      <div css={accordionContainer}>
        <Accordion>
          <TabAccordionRow trackingId={accordionTrackingId} label="Delivery details">
            <p>
              Your newspaper will arrive before 8am from Monday to Saturday and before 8.30am on Sunday.
            </p>
            <p>
              We can’t deliver to individual flats, or apartments within blocks because we need
              access to your post box to deliver your newspaper.
            </p>
            <p>
              You can pause your subscription for up to 36 days a year. So if you’re going away
              anywhere, you won’t have to pay for the newspapers that you miss.
            </p>
          </TabAccordionRow>
        </Accordion>
      </div>
    </div>
    <GridImage gridId="printCampaignHDdigitalVoucher" srcSizes={[500, 140]} sizes="(max-width: 740px) 100vw, 500px" imgType="png" />
  </FlexContainer>;