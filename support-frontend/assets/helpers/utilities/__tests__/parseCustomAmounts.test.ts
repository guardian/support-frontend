import { parseCustomAmounts } from '../utilities';

describe('parseCustomAmounts', () => {
	test('should parse valid comma-separated amounts', () => {
		const result = parseCustomAmounts('15,30,75');
		expect(result).toEqual([15, 30, 75]);
	});

	test('should filter out invalid amounts (NaN, negative, zero, infinite)', () => {
		const result = parseCustomAmounts('10,invalid,20,-5,0,30,Infinity,NaN');
		expect(result).toEqual([10, 20, 30]);
	});

	test('should remove duplicate amounts', () => {
		const result = parseCustomAmounts('25,50,25,100,50,25,100');
		expect(result).toEqual([25, 50, 100]);
	});

	test('should handle decimal values correctly', () => {
		const result = parseCustomAmounts('12.50,25.75,50.25');
		expect(result).toEqual([12.5, 25.75, 50.25]);
	});

	test('should trim whitespace from amounts', () => {
		const result = parseCustomAmounts(' 15 , 30 , 75 ');
		expect(result).toEqual([15, 30, 75]);
	});

	test('should return empty array when all amounts are invalid', () => {
		const result = parseCustomAmounts('invalid,NaN,-5,0,-10,abc');
		expect(result).toEqual([]);
	});

	test('should return empty array for empty string', () => {
		const result = parseCustomAmounts('');
		expect(result).toEqual([]);
	});

	test('should handle single valid amount', () => {
		const result = parseCustomAmounts('42');
		expect(result).toEqual([42]);
	});

	test('should handle single invalid amount', () => {
		const result = parseCustomAmounts('invalid');
		expect(result).toEqual([]);
	});

	test('should handle mixed valid and invalid amounts with duplicates', () => {
		const result = parseCustomAmounts('5.5,invalid,5.5,10,abc,-1,10,0,15.75');
		expect(result).toEqual([5.5, 10, 15.75]);
	});
});
