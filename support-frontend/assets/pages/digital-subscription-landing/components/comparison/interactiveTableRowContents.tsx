import type { Node } from "react";
import React from "react";
import { css } from "@emotion/core";
import { space } from "@guardian/src-foundations";
import { from, until, breakpoints } from "@guardian/src-foundations/mq";
import { background, brandAltBackground, brand } from "@guardian/src-foundations/palette";
import { SvgCheckmark } from "@guardian/src-icons";
import { headline } from "@guardian/src-foundations/typography";
import type { CountryGroupId } from "helpers/internationalisation/countryGroup";
import "helpers/internationalisation/countryGroup";
import { sendTrackingEventsOnClick } from "helpers/productPrice/subscriptions";
import GridPicture from "components/gridPicture/gridPicture";
import GridImage from "components/gridImage/gridImage";
import { SvgNews } from "components/icons/news";
import { SvgAdFree } from "components/icons/adFree";
import { SvgEditionsIcon, SvgLiveAppIcon } from "components/icons/appsIcon";
import { SvgOffline } from "components/icons/offlineReading";
import { SvgCrosswords } from "components/icons/crosswords";
import { SvgPadlock } from "components/icons/padlock";
const iconSizeMobile = 28;
const iconSizeDesktop = 34;
const descriptionIcon = css`
  display: inline-flex;
  align-self: center;
  height: ${iconSizeMobile}px;
  width: ${iconSizeMobile}px;
  margin-right: ${space[2]}px;
  svg {
    height: ${iconSizeMobile}px;
    width: ${iconSizeMobile}px;
  }

  ${from.phablet} {
    height: ${iconSizeDesktop}px;
    width: ${iconSizeDesktop}px;

    svg {
      height: ${iconSizeDesktop}px;
      width: ${iconSizeDesktop}px;
    }
  }
`;
const indicators = css`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 27px;
  height: 27px;

  svg {
    height: 27px;
    display: block;
    margin: 0 auto;
  }
`;
const checkmark = css`
  svg {
    max-width: 25px;
  }
`;
const yellowBackground = css`
  background: ${brandAltBackground.primary};
`;
const greyBackground = css`
  background: ${background.secondary};
`;
const hideOnSmall = css`
  ${until.mobileLandscape} {
    display: none;
  }
`;
const detailsCellImageFirst = css`
  display: flex;
  align-items: flex-start;
  flex-direction: column-reverse;

  p {
    margin-top: ${space[3]}px;
  }

  ${from.tablet} {
    flex-direction: row;
    justify-content: space-between;

    > * {
      max-width: 500px;
      flex-basis: 50%;
      margin: 0;
    }
  }
`;
const detailsCellImageFirstContainer = css`
  display: flex;
  align-items: flex-end;
  margin: 0 -${space[3]}px;

  img {
    width: 100%;
  }

  picture {
    display: flex;
    align-items: flex-end;
  }

  ${from.tablet} {
    margin: 0 0 -${space[4]}px;
  }
`;
const detailsCellImageContainerFullHeight = css`
  ${from.tablet} {
    margin-top: -${space[4]}px;
    margin-bottom: -${space[4]}px;
    margin-right: -36px;
  }
`;
const detailsCellImageSecond = css`
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  p {
    margin-bottom: ${space[3]}px;
  }


  ${from.tablet} {
    flex-direction: row-reverse;
    justify-content: space-between;

    > * {
      max-width: 500px;
      flex-basis: 50%;
    }
  }
`;
const detailsCellImageSecondContainer = css`
  display: flex;
  align-items: flex-end;
  margin: 0 -${space[3]}px -${space[4]}px;

  img {
    width: 100%;
  }

  picture {
    display: flex;
    align-items: flex-end;
  }
`;
const detailsCellImageContainerBottomSpacing = css`
  ${until.tablet} {
    margin: 0 -${space[3]}px;
  }
`;
const detailsCellOfflineReading = css`
  display: flex;
  flex-direction: column;

  ${from.tablet} {
    flex-direction: row-reverse;
    justify-content: space-around;
  }
`;
const appFeatureImageContainer = css`
  display: flex;
  flex-basis: 50%;

  ${until.tablet} {
    :last-of-type {
      margin-top: ${space[6]}px;
      margin-bottom: -${space[4]}px;
    }
  }

  ${from.tablet} {
    max-width: 480px;
  }

  picture {
    display: flex;
    align-items: flex-end;
  }

  img {
    max-height: 250px;

    ${until.tablet} {
      max-width: 130px;
    }
  }
`;
const detailsColumnCrosswords = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${from.tablet} {
    flex-direction: row-reverse;
    justify-content: space-around;
  }

  & > * {
    flex-basis: 50%;
    max-width: 500px;
  }
`;
const detailsCellImageCrosswords = css`
  display: flex;
  margin: 0 -${space[3]}px -${space[4]}px;

  img {
    max-height: 200px;
  }

  picture {
    display: flex;
    align-items: flex-end;
  }
`;
const appFeatureContent = css`
  margin-right: ${space[4]}px;

  /* Apply opposite margin if preceded by an image
  https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator */
  picture + & {
    margin-left: ${space[4]}px;
    margin-right: 0;
  }
`;
const appFeatureHeadline = css`
  ${headline.xxxsmall({
  fontWeight: 'bold'
})}
  color: ${brand[400]};
`;

const Padlock = () => <div aria-label="Not included" css={[indicators, greyBackground]}>
    <SvgPadlock />
  </div>;

const Checkmark = () => <div aria-label="Included" css={[indicators, checkmark, yellowBackground]}>
    <SvgCheckmark />
  </div>;

type AppName = "Guardian" | "Editions";
type AppFeatureWithIconPropTypes = {
  appName: AppName;
  children: Node;
  // eslint-disable-next-line react/require-default-props
  heading?: string;
};

const AppFeatureWithIcon = ({
  appName,
  heading = `The ${appName} App`,
  children
}: AppFeatureWithIconPropTypes) => {
  const icon = appName === 'Editions' ? <SvgEditionsIcon /> : <SvgLiveAppIcon />;
  return <section css={appFeatureContent}>
      {icon}
      <h4 css={appFeatureHeadline}>{heading}</h4>
      {children}
    </section>;
};

function trackRowClick(rowId: string) {
  const trackingId = `Comparison_table-${rowId}_row`;
  return (expanded: boolean) => {
    sendTrackingEventsOnClick({
      id: `${trackingId}-${expanded ? 'expand' : 'minimize'}`,
      product: 'DigitalPack',
      componentType: 'ACQUISITIONS_BUTTON'
    })();
  };
}

export function getLocalisedRows(countryGroupId: CountryGroupId) {
  const isAustralia = countryGroupId === 'AUDCountries';
  return {
    journalism: {
      rowId: 'journalism',
      columns: [{
        content: <>
              <div css={descriptionIcon}><SvgNews /></div>
              <span>Access to the Guardian&apos;s quality, open journalism</span>
            </>,
        isPrimary: true
      }, {
        content: <Checkmark />
      }, {
        content: <Checkmark />
      }],
      details: <div css={detailsCellImageFirst}>
          <p>
            Independent, honest reporting should be available for everyone without a paywall. With a subscription,
            you can help to protect the Guardian’s editorial independence and support our model for open access
            journalism, so millions more can benefit.
          </p>
          <div css={detailsCellImageFirstContainer}>
            <GridImage gridId="comparisonTableJournalism" srcSizes={[1000, 500]} sizes="(max-width: 740px) 100%,
                (max-width: 1067px) 150%,
                800px" imgType="png" />
          </div>
        </div>,
      onClick: trackRowClick('journalism')
    },
    adFree: {
      rowId: 'adFree',
      columns: [{
        content: <><div css={descriptionIcon}><SvgAdFree /></div>
            <span>Ad-free reading on all your devices</span></>,
        isPrimary: true
      }, {
        content: <Padlock />
      }, {
        content: <Checkmark />
      }],
      details: <div css={detailsCellImageSecond}>
          <p>
            Enjoy an ad-free experience across all of your devices when you&apos;re signed in on your apps
            and theguardian.com
          </p>
          <div css={detailsCellImageSecondContainer}>
            <GridImage gridId="comparisonTableAdFree" srcSizes={[1000, 500]} sizes="(max-width: 740px) 100%,
                (max-width: 1067px) 150%,
                800px" imgType="png" />
          </div>
        </div>,
      onClick: trackRowClick('adFree')
    },
    editionsApp: {
      rowId: 'editionsApp',
      columns: [{
        content: <><div css={descriptionIcon}><SvgEditionsIcon /></div>
            <span><strong>The Editions app:</strong> newspapers reimagined
              <span css={hideOnSmall}> for mobile and tablet</span>
            </span></>,
        isPrimary: true
      }, {
        content: <Padlock />
      }, {
        content: <Checkmark />
      }],
      details: <div css={detailsCellImageFirst}>
          <p>
            Experience digital news differently. Available exclusively to subscribers,{' '}
            {isAustralia ? 'Australia Weekend brings you the stories you need to understand the week' : 'the UK Daily brings you the stories you need for the day'}. With a beginning and an end,
            it’s an immersive, considered alternative to your never-ending news feed.{' '}
            {isAustralia ? 'The UK Daily' : 'Australia Weekend'}{' '}
            and one-off special Editions are also available for you to enjoy.
          </p>
          <div css={[detailsCellImageFirstContainer, detailsCellImageContainerFullHeight]}>
            <GridPicture sources={[{
            gridId: 'comparisonTableEditionsMob',
            srcSizes: [500, 140],
            imgType: 'png',
            sizes: '100vw',
            media: `(max-width: ${breakpoints.tablet - 1}px)`
          }, {
            gridId: 'comparisonTableEditionsDesktop',
            srcSizes: [1000, 500],
            imgType: 'png',
            sizes: '100vw',
            media: `(min-width: ${breakpoints.tablet}px)`
          }]} fallback="comparisonTableEditionsDesktop" fallbackSize={1000} altText="" fallbackImgType="png" />
          </div>
        </div>,
      onClick: trackRowClick('editionsApp')
    },
    premiumApp: {
      rowId: 'premiumApp',
      columns: [{
        content: <><div css={descriptionIcon}><SvgLiveAppIcon /></div>
            <span><strong>The Guardian app</strong> with premium features</span></>,
        isPrimary: true
      }, {
        content: <Padlock />
      }, {
        content: <Checkmark />
      }],
      details: <div css={detailsCellImageSecond}>
          <p>
            <strong>Explore interactive features</strong> that help you stay on top of <strong>breaking news</strong>,
            or keep curious by following topics that matter to you.
          </p>
          <div css={[detailsCellImageSecondContainer, detailsCellImageContainerBottomSpacing]}>
            <GridPicture sources={[{
            gridId: 'comparisonTableGuAppMob',
            srcSizes: [375, 140],
            imgType: 'png',
            sizes: '100vw',
            media: `(max-width: ${breakpoints.tablet - 1}px)`
          }, {
            gridId: 'comparisonTableGuAppDesktop',
            srcSizes: [1000, 500],
            imgType: 'png',
            sizes: '100vw',
            media: `(min-width: ${breakpoints.tablet}px)`
          }]} fallback="comparisonTableGuAppDesktop" fallbackSize={1000} altText="" fallbackImgType="png" />
          </div>
        </div>,
      onClick: trackRowClick('premiumApp')
    },
    offlineReading: {
      rowId: 'offlineReading',
      columns: [{
        content: <><div css={descriptionIcon}><SvgOffline /></div>
            <span>Offline reading in both your apps</span></>,
        isPrimary: true
      }, {
        content: <Padlock />
      }, {
        content: <Checkmark />
      }],
      details: <div css={detailsCellOfflineReading}>
          <div css={appFeatureImageContainer}>
            <GridPicture sources={[{
            gridId: 'comparisonTableOfflineReadingEditionsMob',
            srcSizes: [660, 434],
            imgType: 'png',
            sizes: '100vw',
            media: `(max-width: ${breakpoints.tablet - 1}px)`
          }, {
            gridId: 'comparisonTableOfflineReadingEditionsDesktop',
            srcSizes: [700],
            imgType: 'png',
            sizes: '100vw',
            media: `(min-width: ${breakpoints.tablet}px)`
          }]} fallback="comparisonTableOfflineReadingEditionsDesktop" fallbackSize={700} altText="" fallbackImgType="png" />
            <AppFeatureWithIcon appName="Editions">
              <p>Download any edition from the last 30 days to read anytime, anywhere you are.</p>
            </AppFeatureWithIcon>
          </div>
          <div css={appFeatureImageContainer}>
            <AppFeatureWithIcon appName="Guardian">
              <p><strong>Enhanced offline reading.</strong> Download the news whenever it suits you</p>
            </AppFeatureWithIcon>
            <GridPicture sources={[{
            gridId: 'comparisonTableOfflineReadingGuAppMob',
            srcSizes: [660, 408],
            imgType: 'png',
            sizes: '100vw',
            media: `(max-width: ${breakpoints.tablet - 1}px)`
          }, {
            gridId: 'comparisonTableOfflineReadingGuAppDesktop',
            srcSizes: [690],
            imgType: 'png',
            sizes: '100vw',
            media: `(min-width: ${breakpoints.tablet}px)`
          }]} fallback="comparisonTableOfflineReadingGuAppDesktop" fallbackSize={700} altText="" fallbackImgType="png" />
          </div>
        </div>,
      onClick: trackRowClick('offlineReading')
    },
    crosswords: {
      rowId: 'crosswords',
      columns: [{
        content: <><div css={descriptionIcon}><SvgCrosswords /></div>
            <span>Play interactive crosswords</span></>,
        isPrimary: true
      }, {
        content: <Padlock />
      }, {
        content: <Checkmark />
      }],
      details: <div css={detailsColumnCrosswords}>
          <div>
            <AppFeatureWithIcon appName="Guardian" heading="Daily crosswords">
              <p>Play daily crosswords wherever you are in <strong>the Guardian app.</strong></p>
            </AppFeatureWithIcon>
          </div>
          <div css={detailsCellImageCrosswords}>
            <GridPicture sources={[{
            gridId: 'comparisonTableCrosswordsMob',
            srcSizes: [244],
            imgType: 'png',
            sizes: '100vw',
            media: `(max-width: ${breakpoints.tablet - 1}px)`
          }, {
            gridId: 'comparisonTableCrosswordsDesktop',
            srcSizes: [1000, 500],
            imgType: 'png',
            sizes: '100vw',
            media: `(min-width: ${breakpoints.tablet}px)`
          }]} fallback="comparisonTableCrosswordsDesktop" fallbackSize={1000} altText="" fallbackImgType="png" />
          </div>
        </div>,
      onClick: trackRowClick('crosswords')
    }
  };
}