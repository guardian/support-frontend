import type { ReactNode } from 'react';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import {
	asideBottomCss,
	asideCss,
	asideTopCss,
	formCss,
	mainCss,
	stickyCss,
} from 'components/subscriptionCheckouts/layoutStyles';
import moduleStyles from './layout.module.scss';

const styles = moduleStyles as { wrapper: string };

type AsideWrapPosition = 'top' | 'bottom';
type PropTypes = {
	children: ReactNode;
	aside: ReactNode;
	wrapPosition: AsideWrapPosition | null | undefined;
};

function CheckoutLayout({
	children,
	aside,
	wrapPosition,
}: PropTypes): JSX.Element {
	const wrapCss = wrapPosition === 'bottom' ? asideBottomCss : asideTopCss;
	return (
		<div css={[mainCss, wrapCss]}>
			{wrapPosition === 'top' && <div css={[asideCss, stickyCss]}>{aside}</div>}
			<div css={formCss}>{children}</div>
			{wrapPosition === 'bottom' && <div css={asideCss}>{aside}</div>}
		</div>
	);
}

CheckoutLayout.defaultProps = {
	wrapPosition: 'top',
};

function Content({ children }: { children: ReactNode }): JSX.Element {
	return (
		<LeftMarginSection className={styles.wrapper}>{children}</LeftMarginSection>
	);
}

export { Content };

export default CheckoutLayout;
