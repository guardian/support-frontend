// ----- Imports ----- //
import type {
	AbTest,
	ComponentEvent,
	TAction,
	TComponentType,
} from '@guardian/ophan-tracker-js/support';
import { record, viewId } from '@guardian/ophan-tracker-js/support';
import { testIsActive } from 'helpers/abTests/abtest';
import type { Participations } from 'helpers/abTests/models';
import { getLocal, setLocal } from 'helpers/storage/storage';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

// Re-export types for backward compatibility
export type OphanAction = TAction;
export type OphanComponentType = TComponentType;
export type OphanComponentEvent = ComponentEvent;
export type OphanABPayload = AbTest[]; // For backward compatibility with tests

// ----- Functions ----- //
const trackComponentEvents = (componentEvent: ComponentEvent): void =>
	record({
		componentEvent,
	});

export const buildOphanPayload = (participations: Participations): AbTest[] => {
	const activeTests: Array<[string, string]> =
		Object.entries(participations).filter(testIsActive);

	return activeTests.map((participation) => ({
		name: participation[0],
		variant: participation[1],
		complete: false,
		campaignCodes: [],
	}));
};

const trackAbTests = (participations: Participations): void =>
	record({
		ab: {
			tests: buildOphanPayload(participations),
		},
	});

// Set referring pageview data in localstorage if it's not already there. This is picked up by ophan, see:
// https://github.com/guardian/ophan/blob/75b86abcce07369c8998521399327d436246c016/tracker-js/assets/coffee/ophan/click-path-capture.coffee#L41
// Note - the localstorage item is deleted by tracker-js as soon as it's read, see:
// https://github.com/guardian/ophan/blob/75b86abcce07369c8998521399327d436246c016/tracker-js/assets/coffee/ophan/core.coffee#L72
const setReferrerDataInLocalStorage = (
	acquisitionData: ReferrerAcquisitionData,
): void => {
	const { referrerUrl, referrerPageviewId } = acquisitionData;

	if (!getLocal('ophan_follow') && referrerUrl && referrerPageviewId) {
		setLocal(
			'ophan_follow',
			JSON.stringify({
				refViewId: referrerPageviewId,
				ref: referrerUrl,
			}),
		);
	}
};

const getPageViewId = (): string => viewId;

export {
	trackComponentEvents,
	trackAbTests,
	setReferrerDataInLocalStorage,
	getPageViewId,
};
