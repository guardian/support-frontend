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

type AsideWrapPosition = 'top' | 'bottom';
type PropTypes = {
	children: ReactNode;
	aside: ReactNode;
	asideNoBorders?: boolean;
	wrapPosition: AsideWrapPosition | null | undefined;
};

function CheckoutLayout({
	children,
	aside,
	asideNoBorders,
	wrapPosition,
}: PropTypes): JSX.Element {
	const wrapCss = wrapPosition === 'bottom' ? asideBottomCss : asideTopCss;
	return (
		<div css={[mainCss, wrapCss]}>
			{wrapPosition === 'top' && (
				<div css={[asideCss(!!asideNoBorders), stickyCss]}>{aside}</div>
			)}
			<div css={formCss}>{children}</div>
			{wrapPosition === 'bottom' && (
				<div css={asideCss(!!asideNoBorders)}>{aside}</div>
			)}
		</div>
	);
}

CheckoutLayout.defaultProps = {
	wrapPosition: 'top',
};

function Content({ children }: { children: ReactNode }): JSX.Element {
	return <LeftMarginSection>{children}</LeftMarginSection>;
}

export { Content };

export default CheckoutLayout;
