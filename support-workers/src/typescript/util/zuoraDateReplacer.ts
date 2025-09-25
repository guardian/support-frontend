import { zuoraDateFormat } from '@modules/zuora/utils/common';
import dayjs from 'dayjs';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export function zuoraDateReplacer(key: string, value: unknown): unknown {
	if (typeof value === 'string' && isoDateRegex.test(value)) {
		const date = new Date(value);
		if (!isNaN(date.getTime())) {
			return zuoraDateFormat(dayjs(date));
		}
	}
	return value;
}
