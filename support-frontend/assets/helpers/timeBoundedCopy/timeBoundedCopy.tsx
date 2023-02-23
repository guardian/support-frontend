import type { ReactNode } from 'react';
import type { DateYMDString } from 'helpers/types/DateString';
import type { Option } from 'helpers/types/option';

type LandingPage = 'newspaper' | 'guardianWeekly';

type TimeBoundCopy = {
	startShowingOn: DateYMDString;
	stopShowingOn?: DateYMDString;
	copy: ReactNode;
};

export type TimedCopyCollection = Partial<Record<LandingPage, TimeBoundCopy[]>>;

const timedCopy: TimedCopyCollection = {
	newspaper: [
		{
			startShowingOn: '2022-04-14',
			stopShowingOn: '2022-06-09',
			copy: <></>,
		},
	],
};

const forceQueryKey = 'forceTimeboundCopy';

export function getTimeboundQuery(): Option<Date> {
	const { search } = window.location;

	if (search) {
		const queryList = search.replace('?', '').split('&');
		const overrideQuery = queryList.find((keyValPair) =>
			keyValPair.startsWith(forceQueryKey),
		);
		return overrideQuery
			? new Date(overrideQuery.replace(`${forceQueryKey}=`, ''))
			: null;
	}

	return null;
}

export function getTimeboundCopy(
	page: LandingPage,
	currentDate: Date,
	timedCopyData: TimedCopyCollection = timedCopy,
): ReactNode {
	const copyListForPage = timedCopyData[page];

	if (copyListForPage) {
		const copyToUse = copyListForPage.find((copyForPage) => {
			const startShowingOnDate = new Date(copyForPage.startShowingOn);
			const stopShowingOnDate = copyForPage.stopShowingOn
				? new Date(copyForPage.stopShowingOn)
				: null;
			return (
				startShowingOnDate <= currentDate &&
				(!stopShowingOnDate || stopShowingOnDate >= currentDate)
			);
		});
		return copyToUse ? copyToUse.copy : null;
	}

	return null;
}
