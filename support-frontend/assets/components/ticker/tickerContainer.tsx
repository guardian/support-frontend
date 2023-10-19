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

type TickerContainerProps = {
	tickerCountType: TickerCountType;
	tickerEndType: TickerEndType;
	currencySymbol: string;
	copy: TickerCopy;
	render: (props: TickerProps) => JSX.Element;
};

export function TickerContainer(props: TickerContainerProps): JSX.Element {
	const [tickerConfig, setTickerConfig] = useState<TickerConfigData>({
		total: 0,
		goal: 0,
	});

	const end =
		props.tickerEndType === 'unlimited' &&
		tickerConfig.total > tickerConfig.goal
			? tickerConfig.total + tickerConfig.total * 0.15
			: tickerConfig.goal;

	useEffect(() => {
		void getInitialTickerValues(props.tickerCountType).then(setTickerConfig);
	}, []);

	return props.render({
		total: tickerConfig.total,
		goal: tickerConfig.goal,
		countType: props.tickerCountType,
		endType: props.tickerEndType,
		currencySymbol: props.currencySymbol,
		copy: props.copy,
		end,
	});
}
