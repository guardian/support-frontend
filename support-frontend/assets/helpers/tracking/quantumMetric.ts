import { getGlobal, isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { logException } from 'helpers/utilities/logger';

// Contribution landing page and thank you page (all regions)
const contributionsRegex = /\/contribute(\/thankyou)?(\?.*)?$/;
// Non-Gifting Digi Subs landing page, checkout and thank you page (all regions)
const digiSubRegex = /\/subscribe\/digital(\/checkout|\/thankyou)?(\?.*)?$/;

// For this POC targetPageMatches has been copied from abtest.ts
const targetPageMatches = (
	locationPath: string,
	targetPage: (string | null | undefined) | RegExp,
): boolean => {
	if (!targetPage) {
		return true;
	}

	return locationPath.match(targetPage) != null;
};

const addQM = (): void => {
	const qtm = document.createElement('script');
	qtm.type = 'text/javascript';
	qtm.async = true;
	qtm.src = 'https://cdn.quantummetric.com/qscripts/quantum-gnm.js';
	qtm.integrity = 'sha256-gIZxRmK4EC55a13Ttc/BUjhoWTkfENzcyDadJHhpJW4=';
	qtm.crossOrigin = 'anonymous';
	const d = document.getElementsByTagName('script')[0];
	if (!window.QuantumMetricAPI && d.parentNode) {
		d.parentNode.insertBefore(qtm, d);
	}
};

const init = (): void => {
	// Check feature switch is enabled
	if (!isSwitchOn('enableQuantumMetric')) {
		return;
	}

	const validPage = [contributionsRegex, digiSubRegex].some((regEx) =>
		targetPageMatches(window.location.pathname, regEx),
	);

	// Only run QM on valid page paths
	if (!validPage) {
		return;
	}

	/**
	 * Dynamically load @guardian/consent-management-platform
	 * on condition we're not server side rendering (ssr) the page.
	 * @guardian/consent-management-platform breaks ssr otherwise.
	 */
	if (!getGlobal('ssr')) {
		import('@guardian/consent-management-platform')
			.then(({ onConsentChange }) => {
				onConsentChange((state) => {
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
	}
};

export { init };
