import { useEffect, useState } from 'react';
import { fetchJson } from 'helpers/async/fetch';
import type { TickerProps } from './ticker';
import type {
	TickerConfigData,
	TickerCopy,
	TickerCountType,
	TickerEndType,
} from './types';

function getInitialTickerValues(
	tickerCountType: TickerCountType,
): Promise<TickerConfigData> {
	return fetchJson<TickerConfigData>(
		tickerCountType === 'money' ? '/ticker.json' : '/supporters-ticker.json',
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

function getDefaultTickerEnd(_total: number, goal: number) {
	return goal + goal * 0.15;
}

type TickerContainerProps = {
	countType: TickerCountType;
	endType: TickerEndType;
	currencySymbol: string;
	copy: TickerCopy;
	calculateEnd?: (total: number, goal: number) => number;
	render: (props: TickerProps) => JSX.Element;
};

export function TickerContainer({
	render,
	countType,
	endType,
	currencySymbol,
	copy,
	calculateEnd = getDefaultTickerEnd,
}: TickerContainerProps): JSX.Element {
	const [tickerConfig, setTickerConfig] = useState<TickerConfigData>({
		total: 0,
		goal: 0,
	});

	const end = calculateEnd(tickerConfig.total, tickerConfig.goal);

	useEffect(() => {
		void getInitialTickerValues(countType).then(setTickerConfig);
	}, []);

	return render({
		total: tickerConfig.total,
		goal: tickerConfig.goal,
		countType,
		endType,
		currencySymbol,
		copy,
		end,
	});
}
