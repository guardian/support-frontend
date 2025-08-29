// ----- Imports ----- //

import { viewId } from '@guardian/ophan-tracker-js';
import { testIsActive } from 'helpers/abTests/abtest';
import { type Participations } from 'helpers/abTests/models';
import { get as getCookie } from 'helpers/storage/cookie';
import * as storage from 'helpers/storage/storage';
import {
	getAllQueryParams,
	getAllQueryParamsWithExclusions,
	getQueryParameter,
} from 'helpers/urls/url';
import { deserialiseJsonObject } from 'helpers/utilities/utilities';

// ----- Types ----- //

export type AcquisitionABTest = {
	name: string;
	variant: string;
};

type QueryParameter = {
	name: string;
	value: string;
};

type AcquisitionQueryParameters = QueryParameter[];

export type OphanIds = {
	pageviewId: string;
	browserId?: string | null;
};

// https://github.com/guardian/frontend/blob/master/static/src/javascripts/projects/common/modules/commercial/acquisitions-ophan.js
export type ReferrerAcquisitionData = {
	campaignCode?: string;
	referrerPageviewId?: string;
	referrerUrl?: string;
	componentId?: string;
	componentType?: string;
	source?: string;
	abTests?: AcquisitionABTest[];
	// these aren't in the referrer acquisition data model on frontend, but they're convenient to include
	// as we want to include query parameters in the acquisition event to e.g. facilitate off-platform tracking
	queryParameters?: AcquisitionQueryParameters;
	labels?: string[];
	isRemote?: boolean;
};

export type PaymentAPIAcquisitionData = {
	pageviewId: string;
	browserId?: string | null;
	platform?: string;
	referrerPageviewId?: string;
	referrerUrl?: string;
	campaignCodes?: string[];
	componentId?: string;
	componentType?: string;
	source?: string;
	abTests?: AcquisitionABTest[];
	gaId?: string | null;
	queryParameters?: AcquisitionQueryParameters;
	labels?: string[];
	postalCode: string | null;
};

// ----- Setup ----- //

const ACQUISITIONS_PARAM = 'acquisitionData';
const ACQUISITIONS_STORAGE_KEY = 'acquisitionData';

// ----- Campaigns ----- //

const campaigns: Record<string, string[]> = {
	seven_fifty_middle: ['gdnwb_copts_editorial_memco_seven_fifty_middle'],
	seven_fifty_end: ['gdnwb_copts_editorial_memco_seven_fifty_end'],
	seven_fifty_email: ['gdnwb_copts_email_memco_seven_fifty'],
	epic_paradise_paradise_highlight: [
		'gdnwb_copts_memco_epic_paradise_paradise_highlight',
	],
	epic_paradise_different_highlight: [
		'gdnwb_copts_memco_epic_paradise_different_highlight',
	],
	epic_paradise_control: ['gdnwb_copts_memco_epic_paradise_control'],
	epic_paradise_standfirst: ['gdnwb_copts_memco_epic_paradise_standfirst'],
	banner_just_one_control: ['banner_just_one_control'],
	banner_just_one_just_one: ['banner_just_one_just_one'],
};

export type Campaign = keyof typeof campaigns;

// ----- Functions ----- //

// Retrieves the user's campaign, if known, from the campaign code.
function getCampaign(
	acquisition: ReferrerAcquisitionData,
): Campaign | null | undefined {
	const { campaignCode } = acquisition;

	if (!campaignCode) {
		return null;
	}

	return (
		Object.keys(campaigns).find((campaign) =>
			campaigns[campaign]?.includes(campaignCode),
		) ?? null
	);
}

// Stores the acquisition data in sessionStorage.
function storeReferrerAcquisitionDataInSessionStorage(
	referrerAcquisitionData: ReferrerAcquisitionData,
): boolean {
	try {
		const serialised = JSON.stringify(referrerAcquisitionData);
		storage.setSession(ACQUISITIONS_STORAGE_KEY, serialised);
		return true;
	} catch (err) {
		return false;
	}
}

const toAcquisitionQueryParameters = (
	parameters: Array<[string, string]> | string[][],
): AcquisitionQueryParameters => {
	return parameters.map(([name, value]) => ({ name, value }));
};

const participationsToAcquisitionABTest = (
	participations: Participations,
): AcquisitionABTest[] => {
	const activeTests: Array<[string, string]> =
		Object.entries(participations).filter(testIsActive);

	return activeTests.map(([name, variant]) => ({
		name,
		variant,
	}));
};

// Builds the acquisition object from data and other sources.
function buildReferrerAcquisitionData(
	acquisitionData: Record<string, unknown>,
): ReferrerAcquisitionData {
	// This was how referrer pageview id used to be passed.
	const referrerPageviewId =
		(acquisitionData.referrerPageviewId as string | undefined) ??
		getQueryParameter('REFPVID');

	const campaignCode =
		getQueryParameter('INTCMP') || getQueryParameter('CMP') || undefined;

	const parameterExclusions = [
		'REFPVID',
		'INTCMP',
		'acquisitionData',
		'contributionValue',
		'contribType',
		'currency',
	];

	const queryParameters =
		(acquisitionData.queryParameters as
			| AcquisitionQueryParameters
			| null
			| undefined) ??
		toAcquisitionQueryParameters(
			getAllQueryParamsWithExclusions(parameterExclusions),
		);

	const source =
		campaignCode && /^PPC_/i.test(campaignCode)
			? 'PPC'
			: (acquisitionData.source as string | undefined);

	return {
		referrerPageviewId,
		campaignCode,
		referrerUrl: acquisitionData.referrerUrl as string | undefined,
		componentId: acquisitionData.componentId as string | undefined,
		componentType: acquisitionData.componentType as string | undefined,
		source,
		abTests: (acquisitionData.abTest
			? [acquisitionData.abTest]
			: acquisitionData.abTests) as AcquisitionABTest[] | undefined,
		queryParameters: queryParameters.length > 0 ? queryParameters : [],
		labels: acquisitionData.labels as string[] | undefined,
		isRemote: acquisitionData.isRemote as boolean | undefined,
	};
}

const getOphanIds = (): OphanIds => ({
	pageviewId: viewId,
	browserId: getCookie('bwid'),
});

function getSupportAbTests(
	participations: Participations,
): AcquisitionABTest[] {
	return participationsToAcquisitionABTest(participations);
}

const getAbTests = (
	referrerAcquisitionData: ReferrerAcquisitionData,
	participations: Participations,
) => {
	const alltests = [
		...participationsToAcquisitionABTest(participations),
		...(referrerAcquisitionData.abTests ?? []),
	];

	return alltests.reduce(
		(acc: AcquisitionABTest[], abTest: AcquisitionABTest) =>
			acc.find((test) => test.name === abTest.name)
				? acc
				: acc.concat([abTest]),
		[],
	);
};

function derivePaymentApiAcquisitionData(
	referrerAcquisitionData: ReferrerAcquisitionData,
	nativeAbParticipations: Participations,
	postalCode: string | null,
): PaymentAPIAcquisitionData {
	const ophanIds: OphanIds = getOphanIds();
	const abTests = getAbTests(referrerAcquisitionData, nativeAbParticipations);
	const campaignCodes = referrerAcquisitionData.campaignCode
		? [referrerAcquisitionData.campaignCode]
		: [];

	return {
		platform: 'SUPPORT',
		browserId: ophanIds.browserId,
		pageviewId: ophanIds.pageviewId,
		referrerPageviewId: referrerAcquisitionData.referrerPageviewId,
		referrerUrl: referrerAcquisitionData.referrerUrl,
		componentId: referrerAcquisitionData.componentId,
		campaignCodes,
		componentType: referrerAcquisitionData.componentType,
		source: referrerAcquisitionData.source,
		abTests,
		gaId: getCookie('_ga'),
		queryParameters: referrerAcquisitionData.queryParameters,
		labels: referrerAcquisitionData.labels,
		postalCode: postalCode,
	};
}

// Reads the acquisition data from sessionStorage.
function getReferrerAcquisitionDataFromSessionStorage():
	| ReferrerAcquisitionData
	| null
	| undefined {
	const stored = storage.getSession(ACQUISITIONS_STORAGE_KEY);

	return stored
		? (deserialiseJsonObject(stored) as ReferrerAcquisitionData)
		: null;
}

function getAcquisitionDataFromUtmParams():
	| Record<string, string | AcquisitionABTest | AcquisitionQueryParameters>
	| undefined {
	// Same order of fields as https://reader-revenue-lynx.s3.eu-west-1.amazonaws.com/v3.html
	const utmCampaign = getQueryParameter('utm_campaign');
	const utmContent = getQueryParameter('utm_content');
	const utmTerm = getQueryParameter('utm_term');
	const utmSource = getQueryParameter('utm_source');
	const utmMedium = getQueryParameter('utm_medium');

	// All must be present in the URL for them to be accepted
	if (
		utmCampaign !== '' &&
		utmContent !== '' &&
		utmTerm !== '' &&
		utmSource !== '' &&
		utmMedium !== ''
	) {
		return {
			campaignCode: utmCampaign,
			abTest: {
				name: utmContent,
				variant: utmTerm,
			},
			source: utmSource,
			componentType: utmMedium,
			queryParameters: toAcquisitionQueryParameters(getAllQueryParams()),
		};
	}

	return;
}

// Reads the acquisition data from the &acquistionData param containing a serialised JSON string.
function getAcquisitionDataFromAcquisitionDataParam():
	| Record<string, unknown>
	| null
	| undefined {
	if (getQueryParameter(ACQUISITIONS_PARAM)) {
		return deserialiseJsonObject(getQueryParameter(ACQUISITIONS_PARAM));
	}

	return null;
}

// Generates appropriate acquisition data from the various, known, PPC params
function getAcquisitionDataFromPPCParams():
	| Record<string, unknown>
	| null
	| undefined {
	if (getQueryParameter('gclid')) {
		return {
			source: 'PPC',
			campaignCode: 'Google_Adwords',
			queryParameters: toAcquisitionQueryParameters(getAllQueryParams()),
		};
	}

	return null;
}

// Returns the acquisition metadata, either from query param or sessionStorage.
// Also stores in sessionStorage if not present or new from param.
function getReferrerAcquisitionData(): ReferrerAcquisitionData {
	// Read acquisitonData from the various query params, or from sessionStorage, in the following precedence
	const candidateAcquisitionData =
		getAcquisitionDataFromAcquisitionDataParam() ??
		getAcquisitionDataFromUtmParams() ??
		getAcquisitionDataFromPPCParams() ??
		getReferrerAcquisitionDataFromSessionStorage();

	const referrerAcquisitionData = buildReferrerAcquisitionData(
		candidateAcquisitionData ?? {},
	);

	storeReferrerAcquisitionDataInSessionStorage(referrerAcquisitionData);

	return referrerAcquisitionData;
}

// ----- Exports ----- //
export {
	getCampaign,
	getReferrerAcquisitionData,
	getOphanIds,
	participationsToAcquisitionABTest,
	derivePaymentApiAcquisitionData,
	getSupportAbTests,
};
