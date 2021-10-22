import { getGlobal } from 'helpers/globalsAndSwitches/globals';

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
			.catch((err) => {
				console.log(err);
			});
	}
};

export { init };
