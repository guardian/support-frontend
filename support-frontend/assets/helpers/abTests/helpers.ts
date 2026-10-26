import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import seedrandom from 'seedrandom';
import type { Participations } from './models';

export function getParticipationFromQueryString(
	queryString: string,
	param: string,
): Participations | undefined {
	const params = new URLSearchParams(queryString);
	const value = params.get(param);
	if (value) {
		const [testName, variantName] = value.split(':');
		if (testName && variantName) {
			return { [testName]: variantName };
		}
	}
	return;
}

export const countryGroupMatches = (
	targetedCountryGroups: CountryGroupId[] = [],
	countryGroupId: CountryGroupId,
): boolean => {
	if (targetedCountryGroups.length === 0) {
		return true;
	} // no targeting
	else {
		return targetedCountryGroups.includes(countryGroupId);
	}
};

export function randomNumber(mvtId: number, seed: string): number {
	const rng = seedrandom(mvtId + seed);
	return Math.abs(rng.int32());
}

export function isWithinSchedule(
	scheduler: { start?: string; end?: string } | undefined,
): boolean {
	if (!scheduler) {
		return true;
	}
	const now = new Date().toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM" UTC
	if (scheduler.start !== undefined && now < scheduler.start) {
		return false;
	}
	if (scheduler.end !== undefined && now > scheduler.end) {
		return false;
	}
	return true;
}
