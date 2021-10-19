import React from "react";
import { isInCsrMode, useCsrDetails } from "components/csr/csrMode";
import { css } from "@emotion/core";
const container = css`
  margin-bottom: 57px;
`;
const banner = css`
  padding: 16px 8px;
  background-color: #555;
  color: white;
  border-bottom: solid 1px white;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
`;

const CsrBanner = () => {
  const csrUsername = useCsrDetails();

  if (isInCsrMode()) {
    return <div css={container}>
        <div css={banner}>You are in customer support mode. Signed in as: {csrUsername}</div>
      </div>;
  }

  return null;
};

export default CsrBanner;