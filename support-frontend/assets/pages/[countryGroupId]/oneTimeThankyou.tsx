import { ThankYouComponent } from './components/thankyou';
import type { ThankYouProps } from './thank-you';

export function OneTimeThankYou({ geoId, appConfig }: ThankYouProps) {
	const searchParams = new URLSearchParams(window.location.search);

	/** Get and validate the amount */
	const contributionParam = searchParams.get('contribution');
	const contributionAmount = contributionParam
		? parseInt(contributionParam, 10)
		: undefined;
	const finalAmount = contributionAmount ?? 0;
	const payment = {
		originalAmount: finalAmount,
		finalAmount: finalAmount,
	};

	return (
		<ThankYouComponent geoId={geoId} appConfig={appConfig} payment={payment} />
	);
}
