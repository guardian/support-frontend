import { replaceDatesWithZuoraFormat } from '../util/zuoraDateReplacer';

describe('replaceDatesWithZuoraFormatDeep', () => {
	const realDate = new Date('2025-09-01T12:25:09Z');
	const isoString = '2025-10-15T08:30:00Z';

	it('formats Date instances at root without changing the input', () => {
		const original = { date: realDate };
		const result = replaceDatesWithZuoraFormat(original);
		expect(result.date).toBe('2025-09-01');
		expect(original.date).toBeInstanceOf(Date);
	});

	it('leaves date strings unchanged', () => {
		const result = replaceDatesWithZuoraFormat({ d: isoString }) as {
			d: string;
		};
		expect(result.d).toBe(isoString);
	});

	it('formats deeply nested dates', () => {
		const original = {
			level1: {
				arr: [realDate, 'test'],
			},
		};
		const result = replaceDatesWithZuoraFormat(original);
		expect(result.level1.arr[0]).toBe('2025-09-01');
		expect(result.level1.arr[1]).toBe('test');
	});

	it('handles arrays of dates', () => {
		const original = ['test', realDate, isoString];
		const result = replaceDatesWithZuoraFormat(original);
		expect(result).toEqual(['test', '2025-09-01', isoString]);
	});
});
