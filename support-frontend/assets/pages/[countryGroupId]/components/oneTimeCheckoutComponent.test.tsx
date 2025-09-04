import '@testing-library/jest-dom';
import { getAmountsTestVariant } from '../../../helpers/abTests/abtest';
import type { SelectedAmountsVariant } from '../../../helpers/contributions';
import { parseCustomAmounts } from '../../../helpers/utilities/utilities';

// Mock the getAmountsTestVariant function
jest.mock('../../../helpers/abTests/abtest', () => ({
	getAmountsTestVariant: jest.fn(),
}));

// Mock the geoIdConfig
jest.mock('../../geoIdConfig', () => ({
	getGeoIdConfig: jest.fn(() => ({
		currency: { glyph: '£', isPaddedGlyph: false, isSuffixGlyph: false },
		currencyKey: 'GBP',
		countryGroupId: 'GBPCountries',
	})),
}));

// Mock window.location
const mockLocation = {
	search: '',
	pathname: '/uk/one-time-checkout',
};

Object.defineProperty(window, 'location', {
	value: mockLocation,
	writable: true,
});

const mockSelectedAmountsVariant = {
	testName: 'FALLBACK_AMOUNTS__GBPCountries',
	variantName: 'CONTROL',
	defaultContributionType: 'MONTHLY',
	displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
	amountsCardData: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
			hideChooseYourAmount: false,
		},
		MONTHLY: {
			amounts: [5, 10, 20],
			defaultAmount: 10,
			hideChooseYourAmount: false,
		},
		ANNUAL: {
			amounts: [60, 100, 250, 500],
			defaultAmount: 60,
			hideChooseYourAmount: false,
		},
	},
} satisfies SelectedAmountsVariant;

// Helper function to create a deep copy with proper typing
function deepCopySelectedAmountsVariant(
	variant: SelectedAmountsVariant,
): SelectedAmountsVariant {
	return {
		testName: variant.testName,
		variantName: variant.variantName,
		defaultContributionType: variant.defaultContributionType,
		displayContributionType: [...variant.displayContributionType],
		amountsCardData: {
			ONE_OFF: {
				amounts: [...variant.amountsCardData.ONE_OFF.amounts],
				defaultAmount: variant.amountsCardData.ONE_OFF.defaultAmount,
				hideChooseYourAmount:
					variant.amountsCardData.ONE_OFF.hideChooseYourAmount,
			},
			MONTHLY: {
				amounts: [...variant.amountsCardData.MONTHLY.amounts],
				defaultAmount: variant.amountsCardData.MONTHLY.defaultAmount,
				hideChooseYourAmount:
					variant.amountsCardData.MONTHLY.hideChooseYourAmount,
			},
			ANNUAL: {
				amounts: [...variant.amountsCardData.ANNUAL.amounts],
				defaultAmount: variant.amountsCardData.ANNUAL.defaultAmount,
				hideChooseYourAmount:
					variant.amountsCardData.ANNUAL.hideChooseYourAmount,
			},
		},
	};
}

describe('OneTimeCheckoutComponent - Custom Amounts URL Processing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockLocation.search = '';

		(getAmountsTestVariant as jest.Mock).mockReturnValue({
			selectedAmountsVariant: mockSelectedAmountsVariant,
			amountsParticipation: undefined,
		});
	});

	test('should create custom amounts data when custom amounts parameter is provided', () => {
		// Set up URL with custom amounts parameter
		mockLocation.search = '?amounts=15,30,75';

		// Simulate the URLSearchParams logic from the component
		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		// Create a copy of the mock to simulate the component behavior
		const selectedAmountsVariant = deepCopySelectedAmountsVariant(
			mockSelectedAmountsVariant,
		);

		// This is the exact logic from the component
		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = selectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Verify the custom amounts data was created correctly
		expect(customAmountsData).toBeDefined();
		expect(customAmountsData?.amounts).toEqual([15, 30, 75]);
		expect(customAmountsData?.defaultAmount).toBe(30); // amounts[1]
		expect(customAmountsData?.hideChooseYourAmount).toBe(false);

		// Verify the final destructured values
		expect(amounts).toEqual([15, 30, 75]);
		expect(defaultAmount).toBe(30);
		expect(hideChooseYourAmount).toBe(false);

		// Verify original variant data remains unchanged
		expect(selectedAmountsVariant.amountsCardData['MONTHLY'].amounts).toEqual([
			5, 10, 20,
		]);
		expect(selectedAmountsVariant.amountsCardData['ANNUAL'].amounts).toEqual([
			60, 100, 250, 500,
		]);
	});

	test('should filter out invalid amounts and keep only valid ones', () => {
		mockLocation.search = '?amounts=10,invalid,20,-5,0,30,Infinity,NaN';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should only include valid positive finite amounts
		expect(amounts).toEqual([10, 20, 30]);
		expect(defaultAmount).toBe(20); // amounts[1]
		expect(hideChooseYourAmount).toBe(false);
	});

	test('should remove duplicate amounts', () => {
		mockLocation.search = '?amounts=25,50,25,100,50,25,100';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should remove duplicates and keep first occurrence
		expect(amounts).toEqual([25, 50, 100]);
		expect(defaultAmount).toBe(50); // amounts[1]
		expect(hideChooseYourAmount).toBe(false);
	});

	test('should handle decimal values correctly', () => {
		mockLocation.search = '?amounts=12.50,25.75,50.25';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should handle decimal values correctly (parseFloat handles trailing zeros)
		expect(amounts).toEqual([12.5, 25.75, 50.25]);
		expect(defaultAmount).toBe(25.75); // amounts[1]
		expect(hideChooseYourAmount).toBe(false);
	});

	test('should trim whitespace from amounts', () => {
		mockLocation.search = '?amounts= 15 , 30 , 75 ';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should handle whitespace correctly
		expect(amounts).toEqual([15, 30, 75]);
		expect(defaultAmount).toBe(30); // amounts[1]
		expect(hideChooseYourAmount).toBe(false);
	});

	test('should not create custom amounts data when custom amounts parameter is empty', () => {
		mockLocation.search = '?amounts=';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		const selectedAmountsVariant = deepCopySelectedAmountsVariant(
			mockSelectedAmountsVariant,
		);

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = selectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should not create custom amounts data when parameter is empty
		expect(customAmountsData).toBeUndefined();
		
		// Should use original amountsCardData values
		expect(amounts).toEqual(mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].amounts);
		expect(defaultAmount).toBe(mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].defaultAmount);
		expect(hideChooseYourAmount).toBe(mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].hideChooseYourAmount);
	});

	test('should not create custom amounts data when no custom amounts parameter is provided', () => {
		mockLocation.search = '';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		const selectedAmountsVariant = deepCopySelectedAmountsVariant(
			mockSelectedAmountsVariant,
		);

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = selectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should not create custom amounts data when no parameter
		expect(customAmountsData).toBeUndefined();
		expect(customAmountsParam).toBeNull();
		
		// Should use original amountsCardData values
		expect(amounts).toEqual(mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].amounts);
		expect(defaultAmount).toBe(mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].defaultAmount);
		expect(hideChooseYourAmount).toBe(mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].hideChooseYourAmount);
	});

	test('should set amounts to empty array when all custom amounts are invalid', () => {
		mockLocation.search = '?amounts=invalid,NaN,-5,0,-10,abc';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should result in empty array when all amounts are invalid
		expect(amounts).toEqual([]);
		expect(defaultAmount).toBe(0); // amounts[1] ?? 0 when amounts[1] is undefined
		expect(hideChooseYourAmount).toBe(false);
	});

	test('should handle single custom amount and set defaultAmount to 0', () => {
		mockLocation.search = '?amounts=25';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should have single amount and defaultAmount should be 0 (amounts[1] is undefined)
		expect(amounts).toEqual([25]);
		expect(defaultAmount).toBe(0); // amounts[1] ?? 0 when amounts[1] is undefined
		expect(hideChooseYourAmount).toBe(false);
	});

	test('should handle two custom amounts and set defaultAmount to second amount', () => {
		mockLocation.search = '?amounts=25,50';

		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		let customAmountsData;
		if (customAmountsParam) {
			const amounts = parseCustomAmounts(customAmountsParam);
			customAmountsData = {
				amounts,
				defaultAmount: amounts[1] ?? 0,
				hideChooseYourAmount: false,
			};
		}

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount, hideChooseYourAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should have two amounts and defaultAmount should be second amount
		expect(amounts).toEqual([25, 50]);
		expect(defaultAmount).toBe(50); // amounts[1]
		expect(hideChooseYourAmount).toBe(false);
	});

	describe('URLSearchParams behavior', () => {
		test('should correctly extract amounts parameter from URL', () => {
			mockLocation.search = '?amounts=15,30,75&other=param';

			const urlSearchParams = new URLSearchParams(mockLocation.search);
			const customAmountsParam = urlSearchParams.get('amounts');

			expect(customAmountsParam).toBe('15,30,75');
		});

		test('should return null when amounts parameter is not present', () => {
			mockLocation.search = '?other=param';

			const urlSearchParams = new URLSearchParams(mockLocation.search);
			const customAmountsParam = urlSearchParams.get('amounts');

			expect(customAmountsParam).toBeNull();
		});

		test('should return empty string when amounts parameter is empty', () => {
			mockLocation.search = '?amounts=&other=param';

			const urlSearchParams = new URLSearchParams(mockLocation.search);
			const customAmountsParam = urlSearchParams.get('amounts');

			expect(customAmountsParam).toBe('');
		});
	});
});
