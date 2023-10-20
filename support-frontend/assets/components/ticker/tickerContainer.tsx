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

function getTickerEndAmount(
	endType: TickerEndType,
	tickerConfig: TickerConfigData,
) {
	const goalReached = tickerConfig.total > tickerConfig.goal;
	if (endType === 'unlimited' && goalReached) {
		return tickerConfig.total + tickerConfig.total * 0.15;
	}
	return tickerConfig.goal;
}

type TickerContainerProps = {
	countType: TickerCountType;
	endType: TickerEndType;
	currencySymbol: string;
	copy: TickerCopy;
	render: (props: TickerProps) => JSX.Element;
};

export function TickerContainer({
	render,
	countType,
	endType,
	currencySymbol,
	copy,
}: TickerContainerProps): JSX.Element {
	const [tickerConfig, setTickerConfig] = useState<TickerConfigData>({
		total: 0,
		goal: 0,
	});

	const end = getTickerEndAmount(endType, tickerConfig);

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
