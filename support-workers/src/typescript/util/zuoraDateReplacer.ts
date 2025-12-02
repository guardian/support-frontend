import { zuoraDateFormat } from '@modules/zuora/utils/common';
import dayjs from 'dayjs';

/**
 * Recursively clones an input value, replacing date instances
 * with the formatted string from `zuoraDateFormat`.
 * Other values are left unchanged. Arrays and plain objects are deep-copied.
 * Does not support circular references.
 */
export type ReplaceDates<T> = T extends Date
	? string
	: T extends (...args: unknown[]) => unknown
	? T
	: T extends string
	? string
	: T extends Array<infer U>
	? Array<ReplaceDates<U>>
	: T extends object
	? { [K in keyof T]: ReplaceDates<T[K]> }
	: T;

export function replaceDatesWithZuoraFormatDeep<T>(input: T): ReplaceDates<T> {
	function formatIfDateLike(v: unknown): unknown {
		if (v instanceof Date && !isNaN(v.getTime())) {
			return zuoraDateFormat(dayjs(v));
		}
		return v;
	}

	function clone(value: unknown): unknown {
		if (value === null) {
			return null;
		}
		if (value instanceof Date) {
			return formatIfDateLike(value);
		}
		if (Array.isArray(value)) {
			return value.map(clone);
		}
		if (typeof value === 'object') {
			const obj = value as Record<string, unknown>;
			const out: Record<string, unknown> = {};
			for (const key of Object.keys(obj)) {
				out[key] = clone(obj[key]);
			}
			return out;
		}
		return value; // strings, numbers, booleans, functions, symbols
	}

	return clone(input) as ReplaceDates<T>;
}
