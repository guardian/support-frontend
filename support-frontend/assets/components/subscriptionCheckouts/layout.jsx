// @flow

import React, { type Node } from 'react';

import styles from './layout.module.scss';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

type AsideWrapPosition = 'top' | 'bottom';

type PropTypes = {
  children: Node,
  aside: Node,
  wrapPosition: ?AsideWrapPosition,
};
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
        <div className={styles.aside}>
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
