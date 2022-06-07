import { onConsentChange } from '@guardian/consent-management-platform';
import { loadScript } from '@guardian/libs';
import type { Participations } from 'helpers/abTests/abtest';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { logException } from 'helpers/utilities/logger';

type SendEventABTestId = 30;

export type SendEventId = SendEventABTestId;

function sendEvent(
	id: SendEventId,
	isConversion: boolean,
	value: string,
): void {
	if (window.QuantumMetricAPI?.isOn()) {
		window.QuantumMetricAPI.sendEvent(id, isConversion ? 1 : 0, value);
	}
}

function sendEventABTestParticipations(participations: Participations): void {
	const sendEventABTestId: SendEventId = 30;
	const valueQueue: string[] = [];

	Object.keys(participations).forEach((testId) => {
		const value = `${testId}-${participations[testId]}`;
		/**
		 * Quantum Metric's script sets up QuantumMetricAPI
		 * We need to check it is defined and ready before we can
		 * send events to it. If it is not ready we add the events to
		 * a valueQueue to be processed later.
		 */
		if (window.QuantumMetricAPI?.isOn()) {
			sendEvent(sendEventABTestId, false, value);
		} else {
			valueQueue.push(value);
		}
	});

	/**
	 * If valueQueue is populated QuantumMetricAPI was not ready to be
	 * sent events, in this scenario we poll a function that checks if
	 * QuantumMetricAPI is available. Once it's available we process the
	 * queue of values to be sent with sendEvent.
	 */
	if (valueQueue.length) {
		const waitForQuantumMetricAPi = setInterval(() => {
			if (window.QuantumMetricAPI?.isOn()) {
				valueQueue.forEach((value) => {
					sendEvent(sendEventABTestId, false, value);
				});
				clearInterval(waitForQuantumMetricAPi);
			}
		}, 100);
	}
}

function addQM(): Promise<void> {
	return new Promise((resolve) => {
		loadScript(
			'https://cdn.quantummetric.com/instrumentation/1.31.3/quantum-gnm.js',
			{
				async: true,
				integrity:
					'sha384-jL1rlM/U30WWRsDEQDalNiDV8FOjayD5RCgzkywrohMqg6oME3zbszWB31/40MAD',
				crossOrigin: 'anonymous',
			},
		)
			.then(() => {
				resolve();
			})
			.catch(() => {
				logException('Failed to load Quantum Metric');
			});
	});
}

function init(participations: Participations): void {
	// return immediately if the feature switch is OFF
	if (!isSwitchOn('featureSwitches.enableQuantumMetric')) {
		return;
	}
	// Check users consent state before adding script
	onConsentChange((state) => {
		if (
			state.ccpa?.doNotSell === false || // check whether US users have NOT withdrawn consent
			state.aus?.personalisedAdvertising || // check whether AUS users have consented to personalisedAdvertising
			(state.tcfv2?.consents && // check TCFv2 purposes for non-US/AUS users
				state.tcfv2.consents['1'] && // Store and/or access information on a device
				state.tcfv2.consents['8'] && // Measure content performance
				state.tcfv2.consents['10']) // Develop and improve products
		) {
			void addQM().then(() => {
				/**
				 * Quantum Metric's script has loaded so we can attempt to
				 * send user AB test participations via the sendEvent function.
				 */
				sendEventABTestParticipations(participations);
			});
		}
	});
}

export { init };
