import { LoadingOverlay } from '../../../components/loadingOverlay/loadingOverlay';

type CheckoutLoadingOverlayProps = {
	showCopy: boolean;
};
export function CheckoutLoadingOverlay({
	showCopy,
}: CheckoutLoadingOverlayProps) {
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
