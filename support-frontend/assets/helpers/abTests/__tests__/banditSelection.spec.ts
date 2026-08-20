import type { Methodology } from '../../globalsAndSwitches/landingPageSettings';
import type { ClientBanditData } from '../../globalsAndSwitches/settings';
import { selectVariantForTest } from '../banditSelection';

interface TestVariant {
	name: string;
	value: string;
}

const createTestVariant = (name: string, value: string): TestVariant => ({
	name,
	value,
});

const createTest = (
	name: string,
	variants: TestVariant[],
	methodologies?: Methodology[],
): {
	name: string;
	variants: TestVariant[];
	methodologies?: Methodology[];
} => ({
	name,
	variants,
	methodologies,
});

const createBanditData = (
	testName: string,
	variants: Array<{ name: string; weight: number }>,
): ClientBanditData => ({
	testName,
	variants,
});

describe('banditSelection', () => {
	describe('selectVariantForTest - EpsilonGreedyBandit', () => {
		const epsilonMethodology: Methodology = {
			name: 'EpsilonGreedyBandit',
			epsilon: 0.1,
		};

		it('selects variant with highest weight when not exploring', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[epsilonMethodology],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 0.5 },
				{ name: 'v2', weight: 0.3 },
				{ name: 'v3', weight: 0.2 },
			]);

			// Mock Math.random to not explore (return > epsilon)
			jest.spyOn(Math, 'random').mockReturnValue(0.5);

			const result = selectVariantForTest(test, 0, [banditData]);

			expect(result?.name).toBe('v1');
		});

		it('selects random variant when exploring (epsilon probability)', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[epsilonMethodology],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 0.9 },
				{ name: 'v2', weight: 0.1 },
				{ name: 'v3', weight: 0.0 },
			]);

			// Mock Math.random to explore (return < epsilon) and select specific variant
			jest
				.spyOn(Math, 'random')
				.mockReturnValueOnce(0.05) // explore, because < epsilon
				.mockReturnValueOnce(0.8); // select random variant index (v3)

			const result = selectVariantForTest(test, 0, [banditData]);

			expect(result?.name).toBe('v3');
		});

		it('selects randomly when all weights are zero', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[epsilonMethodology],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 0 },
				{ name: 'v2', weight: 0 },
				{ name: 'v3', weight: 0 },
			]);

			// Mock Math.random to not explore (return > epsilon)
			// With 3 variants and Math.random() = 0.5, index = Math.floor(0.5 * 3) = 1 (v2)
			jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);

			const result = selectVariantForTest(test, 0, [banditData]);

			expect(result?.name).toBe('v2');
		});

		it('selects randomly when no bandit data available', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
				],
				[epsilonMethodology],
			);

			// With 2 variants and Math.random() = 0.8, index = Math.floor(0.8 * 2) = 1 (v2)
			jest.spyOn(Math, 'random').mockReturnValueOnce(0.8);

			const result = selectVariantForTest(test, 0, []);

			expect(result?.name).toBe('v2');
		});

		it('randomly picks from tied best variants', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[epsilonMethodology],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 0.4 },
				{ name: 'v2', weight: 0.4 },
				{ name: 'v3', weight: 0.2 },
			]);

			// Mock Math.random to not explore, then pick from tied variants
			// With 2 tied variants and Math.random() = 0.5, index = Math.floor(0.5 * 2) = 1 (v2)
			jest
				.spyOn(Math, 'random')
				.mockReturnValueOnce(0.5) // not explore
				.mockReturnValueOnce(0.5); // pick from tied variants

			const result = selectVariantForTest(test, 0, [banditData]);

			expect(result?.name).toBe('v2');
		});

		it('ignores variants in bandit data that are not in test configuration', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
				],
				[epsilonMethodology],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'ghost', weight: 0.9 }, // not in test.variants
				{ name: 'v1', weight: 0.1 },
				{ name: 'v2', weight: 0.0 },
			]);

			// Mock Math.random to not explore
			jest.spyOn(Math, 'random').mockReturnValue(0.5);

			const result = selectVariantForTest(test, 0, [banditData]);

			expect(result?.name).toBe('v1');
		});
	});

	describe('selectVariantForTest - Roulette', () => {
		const rouletteMethodology: Methodology = {
			name: 'Roulette',
		};

		it('selects first, second and third variants based on roulette cumulative weights', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[rouletteMethodology],
			);

			// Weights: v1=1/6, v2=2/6, v3=3/6 (after normalisation)
			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 1 / 6 },
				{ name: 'v2', weight: 2 / 6 },
				{ name: 'v3', weight: 3 / 6 },
			]);

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.15);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v1');

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.49);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v2');

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v3');
		});

		it('applies minimum weight floor of 10%', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[rouletteMethodology],
			);

			// v1 has high weight, v2 and v3 have zero weights (should be boosted to 10% floor)
			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 1 },
				{ name: 'v2', weight: 0 },
				{ name: 'v3', weight: 0 },
			]);

			// After floor: v1=1, v2=0.1, v3=0.1
			// After sorting ascending and normalising:
			// v2≈0.0833, v3≈0.0833, v1≈0.8333
			// Cumulative: v2≈0.0833, v3≈0.1666, v1=1.0
			jest.spyOn(Math, 'random').mockReturnValueOnce(0.08);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v2');

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.16);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v3');

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.2);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v1');
		});

		it('selects randomly when all weights are zero', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[rouletteMethodology],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 0 },
				{ name: 'v2', weight: 0 },
				{ name: 'v3', weight: 0 },
			]);

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.8);

			const result = selectVariantForTest(test, 0, [banditData]);

			expect(result?.name).toBe('v3');
		});

		it('selects randomly when no bandit data available', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
				],
				[rouletteMethodology],
			);

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.7);

			const result = selectVariantForTest(test, 0, []);

			expect(result?.name).toBe('v3');
		});

		it('ignores variants in bandit data that are not in test configuration', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
				],
				[rouletteMethodology],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'ghost', weight: 0.5 },
				{ name: 'v1', weight: 0.5 },
			]);

			const result = selectVariantForTest(test, 0, [banditData]);

			expect(result?.name).toBe('v1');
		});

		it('selects variants correctly with five weighted variants', () => {
			const test = createTest(
				'test-2',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
					createTestVariant('v3', 'value-3'),
					createTestVariant('v4', 'value-4'),
					createTestVariant('v5', 'value-5'),
				],
				[rouletteMethodology],
			);

			// Weights from original SDC test: v1=1, v2=3, v3=4, v4=5, v5=2
			// Normalised: v1=1/15, v2=3/15, v3=4/15, v4=5/15, v5=2/15
			const banditData = createBanditData('test-2', [
				{ name: 'v1', weight: 1 / 15 },
				{ name: 'v2', weight: 3 / 15 },
				{ name: 'v3', weight: 4 / 15 },
				{ name: 'v4', weight: 5 / 15 },
				{ name: 'v5', weight: 2 / 15 },
			]);

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.15);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v5');

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.25);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v2');

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.9999);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v4');

			jest.spyOn(Math, 'random').mockReturnValueOnce(0.65);
			expect(selectVariantForTest(test, 0, [banditData])?.name).toBe('v3');
		});
	});

	describe('selectVariantForTest - ABTest (MVT)', () => {
		const abMethodology: Methodology = {
			name: 'ABTest',
		};

		it('selects variant using MVT (deterministic)', () => {
			const test = createTest(
				'test-1',
				[
					createTestVariant('v1', 'value-1'),
					createTestVariant('v2', 'value-2'),
				],
				[abMethodology],
			);

			const result1 = selectVariantForTest(test, 0, []);
			const result2 = selectVariantForTest(test, 0, []);

			// Same mvtId should produce same result
			expect(result1?.name).toBe(result2?.name);
		});
	});

	describe('selectVariantForTest - Multiple methodologies uses first', () => {
		it('always uses the first methodology regardless of mvtId', () => {
			const methodology1: Methodology = {
				name: 'EpsilonGreedyBandit',
				epsilon: 0.1,
			};

			const methodology2: Methodology = {
				name: 'Roulette',
			};

			const test = createTest(
				'test-1',
				[createTestVariant('v1', 'value-1')],
				[methodology1, methodology2],
			);

			const banditData = createBanditData('test-1', [
				{ name: 'v1', weight: 1.0 },
			]);

			// Mock Math.random to not explore
			jest.spyOn(Math, 'random').mockReturnValue(0.5);

			const result1 = selectVariantForTest(test, 0, [banditData]);
			const result2 = selectVariantForTest(test, 1, [banditData]);

			// Both should use the first methodology (EpsilonGreedyBandit) and return v1
			expect(result1?.name).toBe('v1');
			expect(result2?.name).toBe('v1');
		});
	});

	describe('selectVariantForTest - No methodology (default AB)', () => {
		it('defaults to AB test when no methodology configured', () => {
			const test = createTest('test-1', [
				createTestVariant('v1', 'value-1'),
				createTestVariant('v2', 'value-2'),
			]);

			const result = selectVariantForTest(test, 0, []);

			expect(result).toBeDefined();
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});
});
