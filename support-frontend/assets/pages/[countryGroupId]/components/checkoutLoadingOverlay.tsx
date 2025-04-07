import { LoadingOverlay } from '../../../components/loadingOverlay/loadingOverlay';

export type CheckoutLoadingOverlayProps = {
	showOverlay: boolean;
	showCopy: boolean;
};
export function CheckoutLoadingOverlay({
	showOverlay,
	showCopy,
}: CheckoutLoadingOverlayProps) {
	if (!showOverlay) {
		return null;
	}
	const copy = showCopy ? (
		<div>
			<p>Processing transaction</p>
			<p>Please wait</p>
		</div>
	) : null;

	return (
		<div className="checkoutLoadingOverlay">
			<LoadingOverlay>{copy}</LoadingOverlay>
		</div>
	);
}
