// ----- Imports ----- //
import type { Node } from "react";
import React from "react";
import { css } from "@emotion/core";
import { from, until } from "@guardian/src-foundations/mq";
import { brand } from "@guardian/src-foundations/palette";
import { space } from "@guardian/src-foundations";
import ProductOptionSmall from "components/product/productOptionSmall";
const priceCardContainer = css`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${space[3]}px;
  margin: ${space[5]}px 0;
  margin-top: -${space[3]}px;
  overflow: hidden;

  ${from.tablet} {
    max-width: 450px;
    margin-top: ${space[2]}px;
    padding: 0 ${space[5]}px;
    border-top: none;
    border-left: 1px solid ${brand[600]};
  }
`;
const priceCardTopBorder = css`
  width: 100%;
  ${until.tablet} {
    border-top: 1px solid ${brand[600]};
  }
`;
const roundelContainer = css`
  position: absolute;
  right: -${space[2]}px;
  display: flex;
  align-items: center;
  height: 100%;
  overflow: hidden;

  ${from.tablet} {
    display: none;
  }
`;
const fitAroundBelow = css`
  ${until.tablet} {
    & > p:last-of-type {
      max-width: calc(100% - 80px);
    }
  }
`;
const fitAroundAbove = css`
  ${until.tablet} {
    & > p:first-of-type {
      max-width: calc(100% - 80px);
    }
  }
`;
type PropTypes = {
  roundel: Node;
  priceList: any[];
};
export function HeroPriceCards(props: PropTypes) {
  return <div css={priceCardContainer}>
      <div css={priceCardTopBorder}>
        <div css={roundelContainer}>
          {props.roundel}
        </div>
        <ProductOptionSmall cssOverrides={fitAroundBelow} {...props.priceList[0]} />
        <ProductOptionSmall cssOverrides={fitAroundAbove} {...props.priceList[1]} />
      </div>
    </div>;
}