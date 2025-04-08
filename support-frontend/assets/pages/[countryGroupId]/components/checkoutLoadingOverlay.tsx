import { LoadingOverlay } from '../../../components/loadingOverlay/loadingOverlay';

type CheckoutLoadingOverlayProps = {
	hideProcessingMessage: boolean;
};
export function CheckoutLoadingOverlay({
	hideProcessingMessage,
}: CheckoutLoadingOverlayProps) {
	const copy = hideProcessingMessage ? null : (
		<div>
			<p>Processing transaction</p>
			<p>Please wait</p>
		</div>
	);

	return (
		<div className="checkoutLoadingOverlay">
			<LoadingOverlay>{copy}</LoadingOverlay>
		</div>
	);
}
