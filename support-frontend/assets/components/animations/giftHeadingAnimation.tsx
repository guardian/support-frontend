// ----- Imports ----- //
import React from "react";
import { giftTag, toFromLines, toYouTyping, toYouCursor, fromMeTyping, fromMeCursor, heroHeading } from "./giftHeadingAnimationStyles";

function GiftHeadingAnimation() {
  return <div css={giftTag}>
      <div css={toFromLines}>
        <div css={heroHeading}>To:</div>
        <div css={toYouTyping}>
          <div css={toYouCursor}>You</div>
        </div>
      </div>
      <div css={toFromLines}>
        <div css={heroHeading}>From:</div>
        <div css={fromMeTyping}>
          <div css={fromMeCursor}>Me</div>
        </div>
      </div>
    </div>;
}

export default GiftHeadingAnimation;