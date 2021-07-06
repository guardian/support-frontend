import { css } from "@emotion/core";
import { headline, textSans } from "@guardian/src-foundations/typography/obj";
import { space } from "@guardian/src-foundations";
import { background, border, text } from "@guardian/src-foundations/palette";
import { from, until } from "@guardian/src-foundations/mq";
export const wrapper = css`
  background-color: ${background.primary};
  color: ${text.primary};
`;
export const contentBlock = css`
  display: block;
  width: 100%;
`;
export const imageContainer = css`
  display: inline-flex;
  align-items: flex-start;
  width: calc(100% - 30px);
  padding: ${space[4]}px ${space[4]}px 0;
  background-color: ${background.secondary};

  img {
    width: 100%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
  }

  ${until.tablet} {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;
    padding: ${space[2]}px ${space[2]}px 0;
  }
`;
export const untilTablet = css`
  ${from.tablet} {
    display: none;
  }
`;
export const fromTablet = css`
  ${until.tablet} {
    display: none;
  }
`;
export const textBlock = css`
  h3 {
    ${headline.xxsmall()};
    font-weight: bold;
    margin: ${space[2]}px ${space[2]}px 2px;
  }
`;
export const list = css`
  color: ${text.primary};
  border-top: 1px solid ${border.secondary};
  margin: ${space[3]}px;
  padding-top: ${space[3]}px;
  ${from.desktop} {
    width: calc(100%-${space[3]}px * 2);
  }

  li {
    margin-bottom: ${space[4]}px;
  }
`;
export const listMain = css`
  ${textSans.medium({
  fontWeight: 'bold'
})};
  margin-left: ${space[3]}px;
  display: inline-block;
  max-width: 90%;
`;
export const subText = css`
  display: block;
  ${textSans.small()};
  margin-left: ${space[5]}px;
  line-height: 135%;
`;
export const dot = css`
  display: inline-block;
  height: 9px;
  width: 9px;
  border-radius: 50%;
  background-color: ${background.ctaPrimary};
  vertical-align: top;
  margin-top: ${space[2]}px;
`;