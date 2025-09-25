import { zuoraDateReplacer } from '../util/zuoraDateReplacer';

describe('zuoraDateReplacer', () => {
	const realDate = new Date('2025-09-01T12:25:09Z');

	it('replaces Date objects with formatted string', () => {
		const obj = { date: realDate };
		const result = JSON.stringify(obj, zuoraDateReplacer);
		expect(result).toEqual('{"date":"2025-09-01"}');
	});

	it('leaves non-Date values unchanged', () => {
		const obj = { num: 42, str: 'test', bool: true, nil: null };
		const result = JSON.stringify(obj, zuoraDateReplacer);
		expect(result).toBe(JSON.stringify(obj));
	});

	it('replaces nested Date objects', () => {
		const obj = { nested: { date: realDate } };
		const result = JSON.stringify(obj, zuoraDateReplacer);
		expect(result).toEqual('{"nested":{"date":"2025-09-01"}}');
	});

	it('handles arrays with Date objects', () => {
		const obj = { dates: [realDate, 'not a date', 123] };
		const result = JSON.stringify(obj, zuoraDateReplacer);
		expect(result).toEqual('{"dates":["2025-09-01","not a date",123]}');
	});

	it('ignores invalid date strings', () => {
		const obj = { invalidDate: '2025-13-01T12:00:00Z' }; // Invalid month
		const result = JSON.stringify(obj, zuoraDateReplacer);
		expect(result).toEqual('{"invalidDate":"2025-13-01T12:00:00Z"}');
	});
});
