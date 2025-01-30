// ----- Imports ----- //
import * as ophan from 'ophan';
import { type Participations, testIsActive } from 'helpers/abTests/abtest';
import { getLocal, setLocal } from 'helpers/storage/storage';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

// ----- Types ----- //
// These are to match Thrift definitions which can be found here:
// https://dashboard.ophan.co.uk/docs/thrift/componentevent.html#Struct_ComponentEvent

type OphanProduct =
	| 'CONTRIBUTION'
	| 'RECURRING_CONTRIBUTION'
	| 'MEMBERSHIP_SUPPORTER'
	| 'MEMBERSHIP_PATRON'
	| 'MEMBERSHIP_PARTNER'
	| 'DIGITAL_SUBSCRIPTION'
	| 'PRINT_SUBSCRIPTION';

export type OphanAction =
	| 'INSERT'
	| 'VIEW'
	| 'EXPAND'
	| 'LIKE'
	| 'DISLIKE'
	| 'SUBSCRIBE'
	| 'ANSWER'
	| 'VOTE'
	| 'CLICK';

export type OphanComponentType =
	| 'READERS_QUESTIONS_ATOM'
	| 'QANDA_ATOM'
	| 'PROFILE_ATOM'
	| 'GUIDE_ATOM'
	| 'TIMELINE_ATOM'
	| 'NEWSLETTER_SUBSCRIPTION'
	| 'SURVEYS_QUESTIONS'
	| 'ACQUISITIONS_EPIC'
	| 'ACQUISITIONS_ENGAGEMENT_BANNER'
	| 'ACQUISITIONS_THANK_YOU_EPIC'
	| 'ACQUISITIONS_HEADER'
	| 'ACQUISITIONS_FOOTER'
	| 'ACQUISITIONS_INTERACTIVE_SLICE'
	| 'ACQUISITIONS_NUGGET'
	| 'ACQUISITIONS_STANDFIRST'
	| 'ACQUISITIONS_THRASHER'
	| 'ACQUISITIONS_EDITORIAL_LINK'
	| 'ACQUISITIONS_BUTTON'
	| 'ACQUISITIONS_OTHER';

type OphanComponent = {
	componentType: OphanComponentType;
	id?: string;
	products?: readonly OphanProduct[];
	campaignCode?: string;
	labels?: readonly string[];
};

export type OphanComponentEvent = {
	component: OphanComponent;
	action: OphanAction;
	value?: string;
	id?: string;
	abTest?: {
		name: string;
		variant: string;
	};
};

type OphanABEvent = {
	variantName: string;
	complete: boolean;
	campaignCodes?: string[];
};

export type OphanABPayload = Record<string, OphanABEvent>;

// ----- Functions ----- //
const trackComponentEvents = (componentEvent: OphanComponentEvent): void =>
	ophan.record({
		componentEvent,
	});

export const buildOphanPayload = (
	participations: Participations,
): OphanABPayload => {
	const activeTests: Array<[string, string]> =
		Object.entries(participations).filter(testIsActive);

	return activeTests.reduce((payload, participation) => {
		const ophanABEvent: OphanABEvent = {
			variantName: participation[1],
			complete: false,
			campaignCodes: [],
		};
		return Object.assign({}, payload, {
			[participation[0]]: ophanABEvent,
		});
	}, {});
};

const trackAbTests = (participations: Participations): void =>
	ophan.record({
		abTestRegister: buildOphanPayload(participations),
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

const getPageViewId = (): string => ophan.viewId;

export {
	trackComponentEvents,
	trackAbTests,
	setReferrerDataInLocalStorage,
	getPageViewId,
};
