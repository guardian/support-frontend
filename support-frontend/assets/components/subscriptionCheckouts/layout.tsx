import type { Node } from 'react';
import React from 'react';
import styles from './layout.module.scss';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import {
	asideBottomCss,
	asideCss,
	asideTopCss,
	formCss,
	mainCss,
	stickyCss,
} from 'components/subscriptionCheckouts/layoutStyles';
type AsideWrapPosition = 'top' | 'bottom';
type PropTypes = {
	children: Node;
	aside: Node;
	wrapPosition: AsideWrapPosition | null | undefined;
};

const CheckoutLayout = ({ children, aside, wrapPosition }: PropTypes) => {
	const wrapCss = wrapPosition === 'bottom' ? asideBottomCss : asideTopCss;
	return (
		<div css={[mainCss, wrapCss]}>
			{wrapPosition === 'top' && <div css={[asideCss, stickyCss]}>{aside}</div>}
			<div css={formCss}>{children}</div>
			{wrapPosition === 'bottom' && <div css={asideCss}>{aside}</div>}
		</div>
	);
};

CheckoutLayout.defaultProps = {
	wrapPosition: 'top',
};

const Content = ({ children }: { children: Node }) => (
	<LeftMarginSection className={styles.wrapper}>{children}</LeftMarginSection>
);

export { Content };
export default CheckoutLayout;
