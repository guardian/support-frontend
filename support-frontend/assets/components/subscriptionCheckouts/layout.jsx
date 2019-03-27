// @flow

import React, { type Node } from 'react';

import styles from './layout.module.scss';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

type PropTypes = {
  children: Node,
  aside: ?Node,
};
const CheckoutLayout = ({ children, aside }: PropTypes) => (
  <div className={[styles.root, aside ? styles.withAside : null].join(' ')}>
    {aside &&
      <div className={styles.aside}>
        {aside}
      </div>
    }
    <div className={styles.form}>
      {children}
    </div>
  </div>
);
CheckoutLayout.defaultProps = {
  aside: null,
};

const Content = ({ children }: {children: Node}) => (
  <LeftMarginSection className={styles.wrapper}>
    {children}
  </LeftMarginSection>
);

export { Content };
export default CheckoutLayout;
