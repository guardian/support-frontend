import { viewId } from 'ophan';
import type { $Keys } from 'utility-types';
// ----- Imports ----- //
import type { Participations } from 'helpers/abTests/abtest';
import { getCampaignCode } from 'helpers/campaigns/campaigns';
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
export type QueryParameter = {
	name: string;
	value: string;
};
export type AcquisitionQueryParameters = QueryParameter[];
export type OphanIds = {
	pageviewId: string;
	visitId?: string;
	browserId?: string;
};
// https://github.com/guardian/frontend/blob/master/static/src/javascripts/projects/common/modules/commercial/acquisitions-ophan.js
export type ReferrerAcquisitionData = {
	campaignCode?: string;
	referrerPageviewId?: string;
	referrerUrl?: string;
	componentId?: string;
	componentType?: string;
	source?: string;
	abTests: AcquisitionABTest[] | null | undefined;
	// these aren't in the referrer acquisition data model on frontend, but they're convenient to include
	// as we want to include query parameters in the acquisition event to e.g. facilitate off-platform tracking
	queryParameters?: AcquisitionQueryParameters;
	labels: string[] | null | undefined;
};
export type PaymentAPIAcquisitionData = {
	pageviewId: string;
	visitId?: string;
	browserId?: string;
	platform?: string;
	referrerPageviewId?: string;
	referrerUrl?: string;
	campaignCodes: string[] | null | undefined;
	componentId?: string;
	componentType?: string;
	source?: string;
	abTests: AcquisitionABTest[] | null | undefined;
	gaId?: string;
	queryParameters?: AcquisitionQueryParameters;
	labels: string[] | null | undefined;
};
// ----- Setup ----- //
const ACQUISITIONS_PARAM = 'acquisitionData';
const ACQUISITIONS_STORAGE_KEY = 'acquisitionData';
const REFERRAL_DATA_PARAM = 'referralData';
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
export type Campaign = $Keys<typeof campaigns>;

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
			campaigns[campaign].includes(campaignCode),
		) || null
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
	parameters: Array<[string, string]>,
): AcquisitionQueryParameters =>
	parameters.reduce((array, item) => {
		array.push({
			name: item[0],
			value: item[1],
		});
		return array;
	}, []);

const participationsToAcquisitionABTest = (
	participations: Participations,
): AcquisitionABTest[] => {
	const response: AcquisitionABTest[] = [];
	Object.keys(participations).forEach((participation) => {
		response.push({
			name: participation,
			variant: participations[participation as any],
		});
	});
	return response;
};

// Builds the acquisition object from data and other sources.
function buildReferrerAcquisitionData(
	acquisitionData: Record<string, any>,
): ReferrerAcquisitionData {
	// This was how referrer pageview id used to be passed.
	const referrerPageviewId =
		acquisitionData.referrerPageviewId || getQueryParameter('REFPVID');
	const campaignCode =
		getCampaignCode() ||
		acquisitionData.campaignCode ||
		getQueryParameter('INTCMP') ||
		getQueryParameter('CMP');
	const parameterExclusions = [
		'REFPVID',
		'INTCMP',
		'acquisitionData',
		'contributionValue',
		'contribType',
		'currency',
	];
	const queryParameters =
		acquisitionData.queryParameters ||
		toAcquisitionQueryParameters(
			getAllQueryParamsWithExclusions(parameterExclusions),
		);
	const source =
		campaignCode && /^PPC_/i.test(campaignCode)
			? 'PPC'
			: acquisitionData.source;
	return {
		referrerPageviewId,
		campaignCode,
		referrerUrl: acquisitionData.referrerUrl,
		componentId: acquisitionData.componentId,
		componentType: acquisitionData.componentType,
		source,
		abTests: acquisitionData.abTest
			? [acquisitionData.abTest]
			: acquisitionData.abTests,
		queryParameters: queryParameters.length > 0 ? queryParameters : [],
		labels: acquisitionData.labels,
	};
}

const getOphanIds = (): OphanIds => ({
	pageviewId: viewId,
	browserId: getCookie('bwid'),
	visitId: getCookie('vsid'),
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
		...(referrerAcquisitionData.abTests || []),
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
): PaymentAPIAcquisitionData {
	const ophanIds: OphanIds = getOphanIds();
	const abTests = getAbTests(referrerAcquisitionData, nativeAbParticipations);
	const campaignCodes = referrerAcquisitionData.campaignCode
		? [referrerAcquisitionData.campaignCode]
		: [];
	return {
		platform: 'SUPPORT',
		visitId: ophanIds.visitId,
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
	};
}

function deriveSubsAcquisitionData(
	referrerAcquisitionData: ReferrerAcquisitionData,
	nativeAbParticipations: Participations,
): ReferrerAcquisitionData {
	const abTests = getAbTests(referrerAcquisitionData, nativeAbParticipations);
	return { ...referrerAcquisitionData, abTests };
}

function deserialiseReferralData(serialised: string): Record<string, any> {
	const [source, socialPlatform, referralCode] = serialised.split('_');
	return {
		componentId: `${source}_${socialPlatform}`,
		source: 'SOCIAL',
		queryParameters: [
			{
				name: 'referralCode',
				value: referralCode,
			},
		],
	};
}

// Reads the acquisition data from sessionStorage.
function getReferrerAcquisitionDataFromSessionStorage():
	| ReferrerAcquisitionData
	| null
	| undefined {
	const stored = storage.getSession(ACQUISITIONS_STORAGE_KEY);
	return stored ? deserialiseJsonObject(stored) : null;
}

// Reads the acquisition data from the &acquistionData param containing a serialised JSON string.
function getAcquisitionDataFromAcquisitionDataParam():
	| Record<string, any>
	| null
	| undefined {
	if (getQueryParameter(ACQUISITIONS_PARAM)) {
		return deserialiseJsonObject(getQueryParameter(ACQUISITIONS_PARAM) || '');
	}

	return null;
}

// Reads the acquisition data from the &referralData param containing _ separated values.
function getAcquisitionDataFromReferralDataParam():
	| Record<string, any>
	| null
	| undefined {
	if (getQueryParameter(REFERRAL_DATA_PARAM)) {
		return deserialiseReferralData(
			getQueryParameter(REFERRAL_DATA_PARAM) || '',
		);
	}

	return null;
}

// Generates appropriate acquisition data from the various, known, PPC params
function getAcquisitionDataFromPPCParams():
	| Record<string, any>
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
		getAcquisitionDataFromReferralDataParam() ||
		getAcquisitionDataFromAcquisitionDataParam() ||
		getAcquisitionDataFromPPCParams() ||
		getReferrerAcquisitionDataFromSessionStorage();
	const referrerAcquisitionData = buildReferrerAcquisitionData(
		candidateAcquisitionData || {},
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
	deriveSubsAcquisitionData,
	getSupportAbTests,
};
