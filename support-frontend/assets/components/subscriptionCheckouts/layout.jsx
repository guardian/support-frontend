// @flow

import React, { type Node } from 'react';

import styles from './layout.module.scss';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

type PropTypes = {
  children: Node,
  aside: ?Node,
  footerAside: ?Node,
};
const CheckoutLayout = ({ children, aside, footerAside }: PropTypes) => {
  let mainClass = styles.root;
  if (aside || footerAside) {
    mainClass = [styles.root, styles.withAside].join(' ');
  }
  return (
    <div className={mainClass}>
      {aside &&
      <div className={styles.aside}>
        {aside}
      </div>
      }
      <div className={styles.form}>
        {children}
      </div>
      {footerAside &&
      <div className={styles.footerAside}>
        {footerAside}
      </div>
      }
    </div>
  );
};

CheckoutLayout.defaultProps = {
  aside: null,
  footerAside: null,
};

const Content = ({ children }: {children: Node}) => (
  <LeftMarginSection className={styles.wrapper}>
    {children}
  </LeftMarginSection>
);

export { Content };
export default CheckoutLayout;
