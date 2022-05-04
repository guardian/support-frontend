import { onConsentChange } from '@guardian/consent-management-platform';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';

function pathIsValid(): boolean {
	const locationPath = window.location.pathname;
	// Contribution landing page and thank you page (all regions)
	const contributionsRegex = /\/contribute|thankyou?(\?.*)?$/;
	// Non-Gifting Digi Subs landing page, checkout and thank you page (all regions)
	const digiSubRegex = /\/subscribe\/digital(\/checkout|\/thankyou)?(\?.*)?$/;

	return [contributionsRegex, digiSubRegex].some(
		(pathRegEx) => locationPath.match(pathRegEx) != null,
	);
}

function addQM(): void {
	const qtm = document.createElement('script');
	qtm.type = 'text/javascript';
	qtm.async = true;
	qtm.src =
		'https://assets.quantummetric.com/instrumentation/1.33.0/quantum-gnm.js';
	qtm.integrity =
		'sha384-aRs7c9S69dV9fGKEfDLqj7QsQUJo2KAfdXtqKIAxOuiCLWgCcVvQnQdq7rTcAhbR';
	qtm.crossOrigin = 'anonymous';
	const d = document.getElementsByTagName('script')[0];
	if (!window.QuantumMetricAPI && d.parentNode) {
		d.parentNode.insertBefore(qtm, d);
	}
}

function init(): void {
	/**
	 * Return immediately if we're Server Side Rendering OR
	 * The feature switch is off OR
	 * the window.location.pathname is NOT valid.
	 *
	 */
	if (!isSwitchOn('featureSwitches.enableQuantumMetric') || !pathIsValid()) {
		return;
	}

	onConsentChange((state) => {
		// Check users consent state
		if (
			state.ccpa?.doNotSell === false || // check whether US users have NOT withdrawn consent
			state.aus?.personalisedAdvertising || // check whether AUS users have consented to personalisedAdvertising
			(state.tcfv2?.consents && // check TCFv2 purposes for non-US/AUS users
				state.tcfv2.consents['1'] && // Store and/or access information on a device
				state.tcfv2.consents['8'] && // Measure content performance
				state.tcfv2.consents['10']) // Develop and improve products
		) {
			addQM();
		}
	});
}

export { init };
