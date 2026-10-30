import { isWithinSchedule } from '../helpers';

describe('isWithinSchedule', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2026-06-15'));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('returns true when scheduler is undefined', () => {
		expect(isWithinSchedule(undefined)).toBe(true);
	});

	it('returns true when scheduler has no start or end', () => {
		expect(isWithinSchedule({})).toBe(true);
	});

	it('returns true when current date is after start with no end', () => {
		expect(isWithinSchedule({ start: '2026-06-01T00:00' })).toBe(true);
	});

	it('returns true when current date equals start (inclusive)', () => {
		expect(isWithinSchedule({ start: '2026-06-15T00:00' })).toBe(true);
	});

	it('returns false when current date is before start', () => {
		expect(isWithinSchedule({ start: '2026-06-20T00:00' })).toBe(false);
	});

	it('returns true when current date is before end with no start', () => {
		expect(isWithinSchedule({ end: '2026-06-30T00:00' })).toBe(true);
	});

	it('returns true when current date equals end (inclusive)', () => {
		expect(isWithinSchedule({ end: '2026-06-15T00:00' })).toBe(true);
	});

	it('returns false when current date is after end', () => {
		expect(isWithinSchedule({ end: '2026-06-10T00:00' })).toBe(false);
	});

	it('returns true when current date is within start and end range', () => {
		expect(
			isWithinSchedule({ start: '2026-06-01T00:00', end: '2026-06-30T00:00' }),
		).toBe(true);
	});

	it('returns false when current date is before the range', () => {
		expect(
			isWithinSchedule({ start: '2026-07-01T00:00', end: '2026-07-31T00:00' }),
		).toBe(false);
	});

	it('returns false when current date is after the range', () => {
		expect(
			isWithinSchedule({ start: '2026-05-01T00:00', end: '2026-06-01T00:00' }),
		).toBe(false);
	});
});
