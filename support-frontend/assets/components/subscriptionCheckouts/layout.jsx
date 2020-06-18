// @flow

import React, { type Node } from 'react';

import styles from './layout.module.scss';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

type AsideWrapPosition = 'top' | 'bottom';

type PropTypes = {
  children: Node,
  aside: ?Node,
  wrapPosition: ?AsideWrapPosition,
};
const CheckoutLayout = ({ children, aside, wrapPosition }: PropTypes) => {
  const mainClass = [styles.root, aside ? styles.withAside : null].join(' ');
  return (
    <div className={mainClass}>
      {aside && wrapPosition === 'top' &&
        <div className={`${styles.aside} ${styles.sticky}`}>
          {aside}
        </div>
      }
      <div className={styles.form}>
        {children}
      </div>
      {aside && wrapPosition === 'bottom' &&
        <div className={styles.aside}>
          {aside}
        </div>
      }
    </div>
  );
};

CheckoutLayout.defaultProps = {
  aside: null,
  wrapPosition: 'top',
};

const Content = ({ children }: {children: Node}) => (
  <LeftMarginSection className={styles.wrapper}>
    {children}
  </LeftMarginSection>
);

export { Content };
export default CheckoutLayout;
