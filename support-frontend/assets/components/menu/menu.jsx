// @flow
import React, { type Node } from 'react';
import styles from './menu.module.scss';
import SvgCheckmark from 'components/svgs/checkmark';

const LinkItem = ({ isSelected, children, ...props }: {children: Node, isSelected: boolean}) => (
  <a {...props} className={styles.item} data-is-selected={isSelected}>
    {children} {isSelected && [<SvgCheckmark />, <span className="accessibility-hint">Selected</span>]}
  </a>);

const Menu = ({ children, ...props }: {children: Node}) => (
  <div {...props} className={styles.root}>
    {children}
  </div>
);

export default Menu;

export { LinkItem };
