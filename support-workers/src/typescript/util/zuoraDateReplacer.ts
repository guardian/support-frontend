import { zuoraDateFormat } from '@modules/zuora/utils/common';
import dayjs from 'dayjs';

/**
 * Recursively clones an input value, replacing Date instances
 * with the formatted string from `zuoraDateFormat`.
 * Other values are left unchanged. Arrays and plain objects are deep-copied.
 * Does not function values or support circular references.
 */
export type ReplaceDates<T> = T extends Date
	? string
	: T extends ReadonlyArray<infer U>
	? ReadonlyArray<ReplaceDates<U>>
	: T extends object
	? { [K in keyof T]: ReplaceDates<T[K]> }
	: T;

function isRecord(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object') {
		return false;
	}
	if (Array.isArray(value) || value instanceof Date) {
		return false;
	}

	const proto: unknown = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

// Overloads return precise types without assertions.
function clone<T extends Record<string, unknown>>(
	value: T,
): { [K in keyof T]: ReplaceDates<T[K]> };
function clone<T>(value: T): ReplaceDates<T>;
function clone(value: unknown): unknown {
	if (value === null) {
		return null;
	}
	if (value instanceof Date) {
		return zuoraDateFormat(dayjs(value));
	}
	if (Array.isArray(value)) {
		return value.map(clone);
	}
	if (isRecord(value)) {
		const out: Record<string, unknown> = {};
		for (const key of Object.keys(value)) {
			out[key] = clone(value[key]);
		}
		return out;
	}
	return value;
}

export function replaceDatesWithZuoraFormat<T>(input: T): ReplaceDates<T> {
	return clone(input);
}
