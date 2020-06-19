// @flow

import React, { type Node } from 'react';

import styles from './layout.module.scss';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';
import { space } from '@guardian/src-foundations';

type AsideWrapPosition = 'top' | 'bottom';

type PropTypes = {
  children: Node,
  aside: Node,
  wrapPosition: ?AsideWrapPosition,
};

const asideCss = css`
  z-index: 99;
  width: 100%;
  border-bottom: 1px solid gu-colour(neutral-86);
  ${from.leftCol} {
    border-right: 1px solid gu-colour(neutral-86);
  }
`;

const mainCss = css`
  max-width: ${space[280]}px;
  ${from.tablet} {
    display: flex;
    align-items: flex-start;
  }
  .form {
    flex: 0 0 auto;
    width: 100%;
  }
`;

const CheckoutLayout = ({ children, aside, wrapPosition }: PropTypes) => {
  const mainClass = [
    styles.root,
    wrapPosition === 'bottom' ? styles.asideBottom : styles.asideTop,
  ].join(' ');

  return (
    <div className={mainClass}>
      {wrapPosition === 'top' &&
        <div className={`${styles.aside} ${styles.sticky}`}>
          {aside}
        </div>
      }
      <div className={styles.form}>
        {children}
      </div>
      {wrapPosition === 'bottom' &&
        <div css={asideCss}>
          {aside}
        </div>
      }
    </div>
  );
};

CheckoutLayout.defaultProps = {
  wrapPosition: 'top',
};

const Content = ({ children }: {children: Node}) => (
  <LeftMarginSection className={styles.wrapper}>
    {children}
  </LeftMarginSection>
);

export { Content };
export default CheckoutLayout;
