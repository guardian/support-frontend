import { useEffect, useState } from 'react';
import { fetchJson } from 'helpers/async/fetch';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { isCodeOrProd } from 'helpers/urls/url';
import type { TickerProps } from './ticker';
import type { TickerConfigData, TickerCountType, TickerEndType } from './types';

function getTickerUrl(tickerCountType: TickerCountType, tickerId: string) {
	if (isCodeOrProd()) {
		return `/ticker/${tickerId}.json`;
	}
	return tickerCountType === 'money'
		? '/ticker.json'
		: '/supporters-ticker.json';
}

function getInitialTickerValues(
	tickerCountType: TickerCountType,
	tickerId: string,
): Promise<TickerConfigData> {
	return fetchJson<TickerConfigData>(
		getTickerUrl(tickerCountType, tickerId),
		{},
	).then((data: TickerConfigData) => {
		const total = Math.floor(data.total);
		const goal = Math.floor(data.goal);
		return {
			total,
			goal,
		};
	});
}

function getDefaultTickerEnd(total: number, goal: number) {
	if (goal > total) return goal;
	return total;
}

type TickerContainerProps = {
	countType: TickerCountType;
	endType: TickerEndType;
	headline: string;
	tickerId: string;
	calculateEnd?: (total: number, goal: number) => number;
	render: (props: TickerProps) => JSX.Element;
};

export function TickerContainer({
	render,
	countType,
	endType,
	headline,
	tickerId,
	calculateEnd = getDefaultTickerEnd,
}: TickerContainerProps): JSX.Element {
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const [tickerConfig, setTickerConfig] = useState<TickerConfigData>({
		total: 0,
		goal: 0,
	});

	const end = calculateEnd(tickerConfig.total, tickerConfig.goal);

	useEffect(() => {
		void getInitialTickerValues(countType, tickerId).then(setTickerConfig);
	}, []);

	return render({
		total: tickerConfig.total,
		goal: tickerConfig.goal,
		countType,
		endType,
		countryGroupId,
		headline,
		end,
	});
}
