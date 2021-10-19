import type { Node } from "react";
import React from "react";
import { ThemeProvider } from "emotion-theming";
import { css } from "@emotion/core";
import { from } from "@guardian/src-foundations/mq";
import { brand } from "@guardian/src-foundations/palette";
import { space } from "@guardian/src-foundations";
import { textSans, headline } from "@guardian/src-foundations/typography";
import { LinkButton, buttonReaderRevenue } from "@guardian/src-button";
import PayPalOneClickCheckoutButton from "components/paypalExpressButton/PayPalOneClickCheckoutButton";
import type { BillingPeriod } from "helpers/productPrice/billingPeriods";
import { DigitalPack } from "helpers/productPrice/subscriptions";
export type ProductSmall = {
  offerCopy: string;
  priceCopy: Node;
  buttonCopy: string;
  href: string;
  onClick: (...args: Array<any>) => any;
  cssOverrides?: string | string[];
  billingPeriod: BillingPeriod;
  showPayPalButton?: boolean;
};
const productOptionSmallStyles = css`
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: ${space[1]}px 0 ${space[6]}px;
  padding-right: ${space[4]}px;
  max-width: 330px;

  &:not(:last-of-type) {
    border-bottom: 1px solid ${brand[600]};
  }

  ${from.tablet} {
    padding-top: ${space[6]}px;
  }
`;
const offerCopyStyles = css`
  ${textSans.medium({
  fontWeight: 'bold'
})}
  margin-bottom: ${space[2]}px;
`;
const priceCopyStyles = css`
  ${textSans.xsmall()}
  margin-top: ${space[2]}px;
`;
const titleCopyStyles = css`
  ${headline.xxsmall({
  fontWeight: 'bold'
})}
  margin-bottom: 4px;
  ::first-letter{
    text-transform: capitalize;
  }
`;
const buttonStyles = css`
  justify-content: center;
`;

function ProductOptionSmall(props: ProductSmall) {
  // This is a hack to avoid changing too much stuff around for the PayPal test
  const titleCopy = props.buttonCopy.replace('Subscribe ', '');
  return <span css={[productOptionSmallStyles, props.cssOverrides]}>
      <p css={titleCopyStyles}>{titleCopy}</p>
      <p css={offerCopyStyles}>{props.offerCopy}</p>
      <ThemeProvider theme={buttonReaderRevenue}>
        <LinkButton css={buttonStyles} href={props.href} onClick={props.onClick}>
          Subscribe now {
          /* just for PayPal test */
        }
        </LinkButton>
      </ThemeProvider>
      {props.showPayPalButton && <PayPalOneClickCheckoutButton billingPeriod={props.billingPeriod} product={DigitalPack} trackingId="one-click-checkout-hero" />}
      <p css={priceCopyStyles}>{props.priceCopy}</p>
    </span>;
}

ProductOptionSmall.defaultProps = {
  offerCopy: '',
  cssOverrides: '',
  showPayPalButton: false
};
export default ProductOptionSmall;