import type { ReactNode } from 'react';
import type { DateYMDString } from 'helpers/types/DateString';
import type { Option } from 'helpers/types/option';

type LandingPage = 'digitalSubscription' | 'newspaper' | 'guardianWeekly';

type TimeBoundCopy = {
	startShowingOn: DateYMDString;
	stopShowingOn?: DateYMDString;
	copy: ReactNode;
};

export type TimedCopyCollection = Partial<Record<LandingPage, TimeBoundCopy[]>>;

const timedCopy: TimedCopyCollection = {
	digitalSubscription: [
		{
			startShowingOn: '2022-04-14',
			stopShowingOn: '2022-06-09',
			copy: (
				<>
					<p>
						<strong>With two innovative apps and ad-free reading,</strong> a
						digital subscription gives you the richest experience of Guardian
						journalism. It also sustains the independent reporting you love.
					</p>
					<p>
						Plus, for a limited time, get inspiration for new ideas to improve
						your life in our exclusive special edition, Self and Wellbeing.
					</p>
				</>
			),
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
