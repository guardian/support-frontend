import { getGlobal, isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { logException } from 'helpers/utilities/logger';

const pathIsValid = (): boolean => {
	const locationPath = window.location.pathname;
	// Contribution landing page and thank you page (all regions)
	const contributionsRegex = /\/contribute(\/thankyou)?(\?.*)?$/;
	// Non-Gifting Digi Subs landing page, checkout and thank you page (all regions)
	const digiSubRegex = /\/subscribe\/digital(\/checkout|\/thankyou)?(\?.*)?$/;

	return [contributionsRegex, digiSubRegex].some(
		(pathRegEx) => locationPath.match(pathRegEx) != null,
	);
};

const addQM = (): void => {
	const qtm = document.createElement('script');
	qtm.type = 'text/javascript';
	qtm.async = true;
	qtm.src = 'https://cdn.quantummetric.com/qscripts/quantum-gnm.js';
	qtm.integrity = 'sha256-IuXtX1j/zKyI5LbQrGw8iwgzo3Yv7JKnHJU8jGHOC1U=';
	qtm.crossOrigin = 'anonymous';
	const d = document.getElementsByTagName('script')[0];
	if (!window.QuantumMetricAPI && d.parentNode) {
		d.parentNode.insertBefore(qtm, d);
	}
};

const init = (): void => {
	/**
	 * Return immediately if we're Server Side Rendering OR
	 * The feature switch is off OR
	 * the window.location.pathname is NOT valid.
	 *
	 */
	if (
		getGlobal('ssr') ||
		!isSwitchOn('enableQuantumMetric') ||
		!pathIsValid()
	) {
		return;
	}

	/**
	 * Dynamically load @guardian/consent-management-platform
	 * on condition we're not server side rendering (ssr) the page.
	 * @guardian/consent-management-platform breaks ssr otherwise.
	 */
	import('@guardian/consent-management-platform')
		.then(({ onConsentChange }) => {
			onConsentChange((state) => {
				// Check users consent state
				if (
					state.ccpa?.doNotSell === false ||
					(state.tcfv2?.consents &&
						state.tcfv2.consents['1'] && // Store and/or access information on a device
						state.tcfv2.consents['8'] && // Measure content performance
						state.tcfv2.consents['10']) // Develop and improve products
				) {
					addQM();
				}
			});
		})
		.catch((error) => {
			logException('Failed to load Quantum Metric', error);
		});
};

export { init };
