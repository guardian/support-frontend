// @flow

import React, { type Node } from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { brand, brandAlt, neutral } from '@guardian/src-foundations/palette';
import { space } from '@guardian/src-foundations';
import { headline, titlepiece } from '@guardian/src-foundations/typography';

import { guardianWeeklyBlue } from 'stylesheets/emotion/colours';

type ThemeType = 'showcase' | 'digital' | 'weekly';

type PropTypes = {|
  title: string,
  theme: ThemeType,
  cssOverrides?: string,
  children: Node,
|}

const themeColors: { [key: ThemeType]: string } = {
  weekly: guardianWeeklyBlue,
  digital: brand[300],
  showcase: brandAlt[400],
};

const headerThemes: { [key: ThemeType]: string } = {
  weekly: css`
    :before {
      background-color: ${themeColors.weekly};
    }
  `,
  digital: css`
    color: ${neutral[97]};
    :before {
      background-color: ${themeColors.digital};
    }
  `,
  showcase: css`
    :before {
      background-color: ${themeColors.showcase};
    }
  `,
};

const header = css`
  color: ${neutral[7]};
  position: relative;
  background: ${neutral[93]};
  display: flex;
  flex-direction: column;
  padding-top: ${space[4]}px;

  :before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 170px;
    content: '';
  }

  ${from.mobileLandscape} {
    :before {
      height: 200px;
    }
  }

  ${from.desktop} {
    :before {
      height:200px;
    }
  }
`;

export const pageTitle = css`
  ${headline.large({ fontWeight: 'bold' })};
  z-index: 10;
  background-color: transparent;
  padding: 0 ${space[4]}px ${space[9]}px;
  width: 100%;

  ${from.mobileLandscape} {
    padding-bottom: ${space[12]}px;
  }

  ${from.phablet} {
    width: 100%;
    align-self: center;
  }

  ${from.tablet} {
    width: calc(100% - 40px);
  }

  ${from.desktop} {
    ${titlepiece.large()}
    max-width: calc(100% - 110px);
    max-width: 1100px;
    padding: 0 ${space[4]}px ${space[12]}px;
  }

  ${from.leftCol} {
    width: calc(100% - 80px);
    max-width: 80.625rem;
  }
`;

function PageTitle({
  title, theme, cssOverrides, children,
}: PropTypes) {
  return (
    <div css={[
      header,
      headerThemes[theme],
      cssOverrides,
    ]}
    >
      <h1 css={pageTitle}>{title}</h1>
      {children}
    </div>
  );
}

PageTitle.defaultProps = {
  cssOverrides: '',
};

export default PageTitle;
