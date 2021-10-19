import React from "react";
import { css } from "@emotion/core";
import { space } from "@guardian/src-foundations";
import { border } from "@guardian/src-foundations/palette";
import { from } from "@guardian/src-foundations/mq";
import type { Option } from "helpers/types/option";
import "helpers/types/option";
import type { PaymentMethod } from "helpers/forms/paymentMethods";
import { DirectDebit } from "helpers/forms/paymentMethods";
import DirectDebitTerms from "./directDebitTerms";
const directDebitSection = css`
  display: block;
  padding: ${space[3]}px;
  padding-top: 0;
  background-color: #F6F6F6;
  border: none;

  ${from.desktop} {
    border-top: 1px solid ${border.secondary};
  }
`;
const borderTop = css`
  display: block;
  border-top: 1px solid ${border.secondary};

  ${from.desktop} {
    border-top: none;
  }
`;
export default function DirectDebitPaymentTerms(props: {
  paymentMethod: Option<PaymentMethod>;
}) {
  return props.paymentMethod === DirectDebit ? <span css={directDebitSection}>
        <span css={borderTop}>
          <DirectDebitTerms />
        </span>
      </span> : null;
}