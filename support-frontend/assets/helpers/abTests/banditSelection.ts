import type { Methodology } from 'helpers/globalsAndSwitches/landingPageSettings';
import type { ClientBanditData } from 'helpers/globalsAndSwitches/settings';

/**
 * Deterministic random number generator for AB tests (consistent across page loads for same mvtId)
 */
function getRandomNumber(seed: string, mvtId: number): number {
	// Simple hash function for deterministic selection
	// Note: order must match Scala implementation (seed + mvtId)
	let hash = 0;
	const str = `${seed}${mvtId}`;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

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

	const randomIndex = getRandomNumber(test.name, mvtId) % test.variants.length;
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
 * Select variant for a test with methodology picking
 * Returns both the variant and the effective test name for tracking
 */
export function selectVariantForTest<VariantType extends { name: string }>(
	test: {
		name: string;
		variants: VariantType[];
		methodologies?: Methodology[];
	},
	mvtId: number,
	banditData: ClientBanditData[],
): { variant: VariantType; trackingTestName: string } | undefined {
	console.log('[banditSelection] selectVariantForTest called', {
		testName: test.name,
		mvtId,
		banditDataCount: banditData.length,
	});
	const methodologies = test.methodologies;
	console.log('[banditSelection] methodologies', methodologies);

	if (!methodologies || methodologies.length === 0) {
		// No configured methodology, default to AB test
		console.log('[banditSelection] No methodologies, using MVT selection');
		const variant = selectVariantUsingMVT(test, mvtId);
		if (variant) {
			return { variant, trackingTestName: test.name };
		}
		return;
	}

	// Pick methodology (if multiple, use mvtId to select one deterministically)
	const methodology =
		methodologies.length === 1
			? methodologies[0]!
			: methodologies[getRandomNumber(test.name, mvtId) % methodologies.length];

	console.log('[banditSelection] Selected methodology', methodology);

	if (!methodology) {
		console.log(
			'[banditSelection] No methodology selected, returning undefined',
		);
		return;
	}

	// Get effective test name with methodology override if specified
	const trackingTestName = methodology.testName ?? test.name;
	console.log('[banditSelection] trackingTestName', trackingTestName);

	// Find bandit data for this test (using effective test name)
	const testBanditData = banditData.find(
		(bd) => bd.testName === trackingTestName,
	);
	console.log('[banditSelection] testBanditData', testBanditData);

	// Select variant based on methodology
	let variant: VariantType | undefined;
	if (methodology.name === 'EpsilonGreedyBandit') {
		console.log('[banditSelection] Using EpsilonGreedyBandit selection');
		variant = selectVariantUsingEpsilonGreedy(
			test,
			methodology.epsilon,
			testBanditData,
		);
	} else if (methodology.name === 'Roulette') {
		console.log('[banditSelection] Using Roulette selection');
		variant = selectVariantUsingRoulette(test, testBanditData);
	} else {
		// ABTest
		console.log('[banditSelection] Using ABTest (MVT) selection');
		variant = selectVariantUsingMVT(test, mvtId);
	}

	console.log('[banditSelection] Selected variant', variant);

	if (variant) {
		return { variant, trackingTestName };
	}

	console.log('[banditSelection] No variant selected, returning undefined');
	return;
}
