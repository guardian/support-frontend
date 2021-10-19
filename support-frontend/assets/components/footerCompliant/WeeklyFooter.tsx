import React from "react";
import Footer from "./Footer";
import { footerTextHeading } from "./footerStyles";
type PropTypes = {
  promoTermsLink: string;
  centred?: boolean;
};
export default function WeeklyFooter({
  promoTermsLink,
  centred
}: PropTypes) {
  return <Footer centred={centred} termsConditionsLink="https://www.theguardian.com/info/2014/jul/10/guardian-weekly-print-subscription-services-terms-conditions">
      <h3 css={footerTextHeading}>Promotion terms and conditions</h3>
      <p>
        Offer subject to availability. Guardian News and Media Limited (&ldquo;GNM&rdquo;) reserves the right to withdraw this promotion at any time. See <a target="_blank" rel="noopener noreferrer" href={promoTermsLink}>annual promotion terms and conditions</a>.
      </p>
    </Footer>;
}
WeeklyFooter.defaultProps = {
  centred: false
};