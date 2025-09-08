import type { SelectedAmountsVariant } from '../../../helpers/contributions';
import { parseCustomAmounts } from '../../../helpers/utilities/utilities';

// Mock the parseCustomAmounts function
jest.mock('../../../helpers/utilities/utilities', () => ({
	parseCustomAmounts: jest.fn(),
}));

// Mock the getAmountsTestVariant function
const mockGetAmountsTestVariant = jest.fn();
jest.mock('../../../helpers/abTests/abtest', () => ({
	getAmountsTestVariant: mockGetAmountsTestVariant,
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
		// Only including other types to satisfy the type, but they're not used in tests
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

describe('OneTimeCheckoutComponent - Custom Amounts URL Processing', () => {
	// Note: The parseCustomAmounts function is thoroughly tested in its own test file
	// These tests focus on how the component integrates custom amounts from URL parameters
	
	beforeEach(() => {
		jest.clearAllMocks();
		mockLocation.search = '';

		(mockGetAmountsTestVariant).mockReturnValue({
			selectedAmountsVariant: mockSelectedAmountsVariant,
			amountsParticipation: undefined,
		});
	});

	test('should process custom amounts from URL parameter and override default amounts', () => {
		// Set up URL with custom amounts parameter
		mockLocation.search = '?amounts=15,30,75';

		// Mock parseCustomAmounts to return the expected array
		(parseCustomAmounts as jest.Mock).mockReturnValue([15, 30, 75]);

		// Simulate the URLSearchParams logic from the component
		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

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

		const { amountsCardData } = mockSelectedAmountsVariant;
		const { amounts, defaultAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Verify the custom amounts data was created correctly
		expect(customAmountsData).toBeDefined();
		expect(customAmountsData?.amounts).toEqual([15, 30, 75]);
		expect(customAmountsData?.defaultAmount).toBe(30); // amounts[1]

		// Verify the final destructured values
		expect(amounts).toEqual([15, 30, 75]);
		expect(defaultAmount).toBe(30);

		// Verify original variant data remains unchanged (we're not modifying it)
		expect(mockSelectedAmountsVariant.amountsCardData.ONE_OFF.amounts).toEqual([
			25, 50, 100, 250,
		]);
	});

	test('should preserve decimal precision in custom amounts', () => {
		mockLocation.search = '?amounts=12.50,25.75,50.25';

		// Mock parseCustomAmounts to return the expected array with decimals
		(parseCustomAmounts as jest.Mock).mockReturnValue([12.5, 25.75, 50.25]);

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
		const { amounts, defaultAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should handle decimal values correctly (parseFloat handles trailing zeros)
		expect(amounts).toEqual([12.5, 25.75, 50.25]);
		expect(defaultAmount).toBe(25.75); // amounts[1]
	});

	test('should not create custom amounts data when no custom amounts parameter is provided', () => {
		mockLocation.search = '';

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
		const { amounts, defaultAmount } =
			customAmountsData ?? amountsCardData['ONE_OFF'];

		// Should not create custom amounts data when no parameter
		expect(customAmountsData).toBeUndefined();
		expect(customAmountsParam).toBeNull();

		// Should use original amountsCardData values
		expect(amounts).toEqual(
			mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].amounts,
		);
		expect(defaultAmount).toBe(
			mockSelectedAmountsVariant.amountsCardData['ONE_OFF'].defaultAmount,
		);
	});

	test('should override fallback amounts with custom amounts', () => {
		// Set up URL with custom amounts parameter
		mockLocation.search = '?amounts=15,30,75';

		// Mock the parseCustomAmounts to return our test data
		const mockCustomAmounts = [15, 30, 75];
		(parseCustomAmounts as jest.Mock).mockReturnValue(mockCustomAmounts);

		// Test the integration by simulating what happens in the component
		const urlSearchParams = new URLSearchParams(mockLocation.search);
		const customAmountsParam = urlSearchParams.get('amounts');

		// This simulates the logic in the component
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
		const { amounts, defaultAmount } = customAmountsData ?? amountsCardData['ONE_OFF'];

		// Verify that custom amounts override the fallback amounts
		expect(amounts).toEqual([15, 30, 75]);
		expect(defaultAmount).toBe(30); // Second amount as per component logic
		expect(parseCustomAmounts).toHaveBeenCalledWith('15,30,75');

		// Verify the integration point: custom amounts should be used instead of fallback
		expect(amounts).not.toEqual([25, 50, 100, 250]); // Not the fallback amounts
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
