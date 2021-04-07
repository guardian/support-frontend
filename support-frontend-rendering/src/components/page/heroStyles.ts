import { css, SerializedStyles } from '@emotion/react';
import { brand, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { Breakpoint, from, until } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';
import { headline, body } from '@guardian/src-foundations/typography';

const roundelSizeMob = 120;
const roundelSize = 180;

export const hero = css`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: ${neutral[100]};
    border: none;
    padding-top: ${space[3]}px;
    background-color: ${brand[400]};
    width: 100%;

    ${from.tablet} {
        flex-direction: row;
    }

    /* Typography defaults */
    ${body.small()}

    ${from.mobileMedium} {
        ${body.medium()};
    }

    ${from.desktop} {
        ${headline.xxsmall()};
        line-height: 135%;
    }
    /* TODO: fix this when we port over the image components */
    .component-grid-picture {
        display: flex;
    }
`;

// On mobile the roundel can overlay and hide the h2 inside the hero
// This adds a little extra top margin if the roundel is present to keep the headline visible
export const roundelOffset = css`
    ${until.tablet} {
        margin-top: ${roundelSizeMob / 2 - space[6]}px;
    }
`;

export const heroImage = css`
    align-self: flex-end;
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;

    ${from.tablet} {
        width: 40%;
    }

    & img {
        max-width: 100%;
    }
`;

export const heroRoundelContainer = css`
    position: absolute;
    top: 0;
    right: ${space[3]}px;

    ${from.tablet} {
        right: ${space[12]}px;
    }
`;

export const heroRoundel = css`
    display: flex;
    align-items: center;
    justify-content: center;
    float: right;
    text-align: center;
    transform: translateY(-67%);
    min-width: ${roundelSizeMob}px;
    max-width: ${roundelSize}px;
    width: calc(100% + ${space[3]}px);
    padding: ${space[1]}px;
    border-radius: 50%;
    background-color: ${brandAlt[400]};
    color: ${neutral[7]};
    ${headline.xxsmall({ fontWeight: 'bold' })};
    z-index: 20;

    ${from.tablet} {
        width: calc(100% + ${space[6]}px);
        transform: translateY(-50%);
        ${headline.small({ fontWeight: 'bold' })};
    }

    /* Combined with float on the main element, this makes the height match the content width for a perfect circle
  cf. https://medium.com/@kz228747/height-equals-width-pure-css-1c79794e470c */
    &::before {
        content: '';
        margin-top: 100%;
    }
`;

export const roundelNudgeUp = css`
    ${until.tablet} {
        transform: translateY(-67%);
    }
`;

export const roundelNudgeDown = css`
    ${until.tablet} {
        transform: translateY(-34%);
    }
`;

function hideUntilBreakpoint(breakpoint: Breakpoint): SerializedStyles {
    return css`
        ${until[breakpoint]} {
            display: none;
        }
    `;
}

export const roundelHidingPoints: { [key in Breakpoint]: SerializedStyles } = {
    mobile: hideUntilBreakpoint('mobile'),
    mobileMedium: hideUntilBreakpoint('mobileMedium'),
    mobileLandscape: hideUntilBreakpoint('mobileLandscape'),
    phablet: hideUntilBreakpoint('phablet'),
    tablet: hideUntilBreakpoint('tablet'),
    desktop: hideUntilBreakpoint('desktop'),
    leftCol: hideUntilBreakpoint('leftCol'),
    wide: hideUntilBreakpoint('wide'),
};
