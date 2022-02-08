import { SvgInfo } from '@guardian/src-icons';
import type { ReactNode } from 'react';
import 'components/gridImage/gridImage';
import * as styles from './orderSummaryStyles';

type MobileOrderSummary = {
	title: ReactNode;
	price: ReactNode;
};
type PropTypes = {
	children: ReactNode;
	changeSubscription?: string | null;
	image: JSX.Element | null;
	mobileSummary: MobileOrderSummary;
	total: ReactNode;
};

function OrderSummary(props: PropTypes): JSX.Element {
	return (
		<aside css={styles.wrapper}>
			<div css={styles.topLine}>
				<div css={styles.topLineBorder}>
					<h3 css={styles.title}>Order summary</h3>
					{props.changeSubscription && (
						<a href={props.changeSubscription}>Change</a>
					)}
				</div>
			</div>
			<div css={styles.contentBlock}>
				<div css={styles.imageContainer}>{props.image}</div>
				<div css={styles.mobileSummary}>
					<h4>{props.mobileSummary.title}</h4>
					<p>{props.mobileSummary.price}</p>
				</div>
			</div>
			<div css={styles.products}>
				<div>{props.children}</div>
				<div css={styles.infoContainer}>
					<div css={styles.info}>
						<SvgInfo />
						<span>You can cancel any time</span>
					</div>
				</div>
				<div css={styles.total} aria-atomic="true" aria-live="polite">
					<span>Total:</span>
					<span>{props.total}</span>
				</div>
			</div>
		</aside>
	);
}

OrderSummary.defaultProps = {
	changeSubscription: '',
};
export default OrderSummary;
