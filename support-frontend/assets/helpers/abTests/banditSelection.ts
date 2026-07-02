import type { ClientBanditData } from 'helpers/globalsAndSwitches/settings';
import { randomNumber } from './helpers';

/**
 * Select variant using MVT (deterministic AB test)
 */
function selectVariantUsingMVT<VariantType extends { name: string }>(
	test: { name: string; variants: VariantType[] },
	mvtId: number,
): VariantType | undefined {
	if (test.variants.length === 0) {
		return;
	}

	const randomIndex = randomNumber(mvtId, test.name) % test.variants.length;
	return test.variants[randomIndex];
}

/**
 * Select a random variant from the test's variants
 */
function selectRandomVariant<VariantType extends { name: string }>(test: {
	variants: VariantType[];
}): VariantType | undefined {
	const randomVariantIndex = Math.floor(Math.random() * test.variants.length);
	return test.variants[randomVariantIndex];
}

/**
 * Filter bandit data variants to only include those that exist in the test configuration
 */
function filterValidVariants<VariantType extends { name: string }>(
	banditVariants: Array<{ name: string; weight: number }>,
	test: { variants: VariantType[] },
): Array<{ name: string; weight: number }> {
	const validVariantNames = new Set(test.variants.map((v) => v.name));
	return banditVariants.filter((v) => validVariantNames.has(v.name));
}

/**
 * Select variant using epsilon-greedy strategy
 * With probability epsilon, select randomly; otherwise select the variant with highest weight
 */
function selectVariantUsingEpsilonGreedy<VariantType extends { name: string }>(
	test: { name: string; variants: VariantType[] },
	epsilon: number,
	banditData?: ClientBanditData,
): VariantType | undefined {
	if (!banditData) {
		// No bandit data available, select randomly
		return selectRandomVariant(test);
	}

	const validVariants = filterValidVariants(banditData.variants, test);

	// Check if all weights are zero (insufficient samples or no data)
	const allWeightsZero = validVariants.every((v) => v.weight === 0);
	if (allWeightsZero || validVariants.length === 0) {
		return selectRandomVariant(test);
	}

	// Choose at random with probability epsilon
	if (Math.random() < epsilon) {
		return selectRandomVariant(test);
	}

	// Select variant with highest weight
	const bestWeight = Math.max(...validVariants.map((v) => v.weight));
	const bestVariants = validVariants.filter((v) => v.weight === bestWeight);

	// If multiple variants have the same best weight, pick randomly among them
	const selectedVariantName =
		bestVariants.length === 1
			? bestVariants[0]!.name
			: bestVariants[Math.floor(Math.random() * bestVariants.length)]!.name;

	return test.variants.find((v) => v.name === selectedVariantName);
}

/**
 * Select variant using roulette wheel selection
 * Variants are selected with probability proportional to their weight
 * Applies a minimum weight floor to ensure no variant gets less than 10%
 */
function selectVariantUsingRoulette<VariantType extends { name: string }>(
	test: { variants: VariantType[] },
	banditData?: ClientBanditData,
): VariantType | undefined {
	if (!banditData) {
		// No bandit data available, select randomly
		return selectRandomVariant(test);
	}

	const validVariants = filterValidVariants(banditData.variants, test);

	// Check if all weights are zero (insufficient samples or no data)
	const allWeightsZero = validVariants.every((v) => v.weight === 0);
	if (allWeightsZero || validVariants.length === 0) {
		return selectRandomVariant(test);
	}

	// Weights are already normalised by the server, but we apply a minimum weight floor
	const minWeight = 0.1; // Ensure no variant gets less than 10%
	const variantsWithWeights = validVariants
		.map(({ name, weight }) => ({
			name,
			weight: Math.max(weight, minWeight),
		}))
		.sort((a, b) => a.weight - b.weight);

	// Normalise weights to sum to 1
	const sumOfWeights = variantsWithWeights.reduce(
		(sum, v) => sum + v.weight,
		0,
	);
	const normalisedWeights = variantsWithWeights.map(({ name, weight }) => ({
		name,
		weight: weight / sumOfWeights,
	}));

	// Roulette wheel selection
	const rand = Math.random();
	let accumulatedWeight = 0;
	for (const variant of normalisedWeights) {
		accumulatedWeight += variant.weight;
		if (rand < accumulatedWeight) {
			return test.variants.find((v) => v.name === variant.name);
		}
	}

	// Fallback to last variant if rounding errors occur (matches Scala implementation)
	const fallbackVariantName = normalisedWeights.at(-1)?.name;
	return (
		test.variants.find((v) => v.name === fallbackVariantName) ??
		selectRandomVariant(test)
	);
}

/**
 * Select variant for a test using its configured methodology.
 * Always uses the first methodology if configured, otherwise defaults to AB test.
 */
export function selectVariantForTest<VariantType extends { name: string }>(
	test: {
		name: string;
		variants: VariantType[];
		methodologies?: Array<{ name: string }>;
	},
	mvtId: number,
	banditData: ClientBanditData[],
): VariantType | undefined {
	const methodologies = test.methodologies;

	if (!methodologies || methodologies.length === 0) {
		// No configured methodology, default to AB test
		return selectVariantUsingMVT(test, mvtId);
	}

	// Always use the first methodology
	const methodology = methodologies[0]!;

	// Find bandit data for this test
	const testBanditData = banditData.find((bd) => bd.testName === test.name);

	// Select variant based on methodology
	if (methodology.name === 'EpsilonGreedyBandit') {
		const epsilon = (methodology as { epsilon?: number }).epsilon ?? 0;
		return selectVariantUsingEpsilonGreedy(test, epsilon, testBanditData);
	} else if (methodology.name === 'Roulette') {
		return selectVariantUsingRoulette(test, testBanditData);
	} else {
		// ABTest
		return selectVariantUsingMVT(test, mvtId);
	}
}
