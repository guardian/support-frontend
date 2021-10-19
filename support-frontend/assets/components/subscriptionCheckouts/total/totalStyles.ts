import { css } from "@emotion/core";
import { textSans } from "@guardian/src-foundations/typography/obj";
import { border } from "@guardian/src-foundations/palette";
import { breakpoints, from } from "@guardian/src-foundations/mq";
export const container = css`
  padding: 10px;
  border-top: 1px solid ${border.secondary};
  ${from.tablet} {
    display: none;
  }
`;
export const wrapper = css`
  display: flex;
  justify-content: space-between;
  max-width: ${breakpoints.mobileMedium}px;
  ${textSans.medium({
  fontWeight: 'bold'
})};
`;