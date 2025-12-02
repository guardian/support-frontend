import { replaceDatesWithZuoraFormatDeep } from '../util/zuoraDateReplacer';

describe('replaceDatesWithZuoraFormatDeep', () => {
	const realDate = new Date('2025-09-01T12:25:09Z');
	const isoString = '2025-10-15T08:30:00Z';

	it('formats Date instances at root', () => {
		const original = { date: realDate };
		const result = replaceDatesWithZuoraFormatDeep(original);
		expect(result.date).toBe('2025-09-01');
		expect(original.date).toBeInstanceOf(Date);
	});

	it('leaves date strings unchanged', () => {
		const result = replaceDatesWithZuoraFormatDeep({ d: isoString }) as {
			d: string;
		};
		expect(result.d).toBe(isoString);
	});

	it('deeply formats nested dates', () => {
		const original = {
			level1: {
				arr: [realDate, 'plain'],
			},
		};
		const result = replaceDatesWithZuoraFormatDeep(original);
		expect(result.level1.arr[0]).toBe('2025-09-01');
		expect(result.level1.arr[1]).toBe('plain');
	});

	it('handles arrays of dates', () => {
		const original = ['test', realDate, isoString];
		const result = replaceDatesWithZuoraFormatDeep(original);
		expect(result).toEqual(['test', '2025-09-01', isoString]);
	});
});
