import type { ContributionsState } from 'helpers/redux/contributionsStore';

export function hasPaymentRequestButtonBeenClicked(
	state: ContributionsState,
): boolean {
	const { paymentRequestButton } = state.page.checkoutForm.payment;
	return (
		paymentRequestButton.ONE_OFF.buttonClicked ||
		paymentRequestButton.REGULAR.buttonClicked
	);
}

export function hasPaymentRequestInterfaceClosed(
	state: ContributionsState,
): boolean {
	const { paymentRequestButton } = state.page.checkoutForm.payment;
	return (
		paymentRequestButton.ONE_OFF.completed ||
		paymentRequestButton.REGULAR.completed
	);
}
