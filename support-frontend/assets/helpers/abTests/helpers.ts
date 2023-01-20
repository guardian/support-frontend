import type { Participations } from 'helpers/abTests/abtest';
import type {
	ContributionAmounts,
	SelectedAmountsAndMetadata,
} from 'helpers/contributions';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

type FallbackAmounts = Record<CountryGroupId, ContributionAmounts>;
export const FALLBACK_AMOUNTS: FallbackAmounts = {
	GBPCountries: {
		ONE_OFF: {
			amounts: [30, 60, 120, 240],
			defaultAmount: 60,
		},
		MONTHLY: {
			amounts: [3, 7, 12],
			defaultAmount: 7,
		},
		ANNUAL: {
			amounts: [60, 120, 240, 480],
			defaultAmount: 120,
		},
	},
	UnitedStates: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
		},
		MONTHLY: {
			amounts: [7, 15, 30],
			defaultAmount: 15,
		},
		ANNUAL: {
			amounts: [50, 100, 250, 500],
			defaultAmount: 50,
		},
	},
	EURCountries: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
		},
		MONTHLY: {
			amounts: [6, 10, 20],
			defaultAmount: 10,
		},
		ANNUAL: {
			amounts: [50, 100, 250, 500],
			defaultAmount: 50,
		},
	},
	International: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
		},
		MONTHLY: {
			amounts: [5, 10, 20],
			defaultAmount: 10,
		},
		ANNUAL: {
			amounts: [60, 100, 250, 500],
			defaultAmount: 60,
		},
	},
	Canada: {
		ONE_OFF: {
			amounts: [25, 50, 100, 250],
			defaultAmount: 50,
		},
		MONTHLY: {
			amounts: [5, 10, 20],
			defaultAmount: 10,
		},
		ANNUAL: {
			amounts: [60, 100, 250, 500],
			defaultAmount: 60,
		},
	},
	AUDCountries: {
		ONE_OFF: {
			amounts: [60, 100, 250, 500],
			defaultAmount: 100,
		},
		MONTHLY: {
			amounts: [10, 20, 40],
			defaultAmount: 20,
		},
		ANNUAL: {
			amounts: [80, 250, 500, 750],
			defaultAmount: 80,
		},
	},
	NZDCountries: {
		ONE_OFF: {
			amounts: [50, 100, 250, 500],
			defaultAmount: 100,
		},
		MONTHLY: {
			amounts: [10, 20, 50],
			defaultAmount: 20,
		},
		ANNUAL: {
			amounts: [50, 100, 250, 500],
			defaultAmount: 50,
		},
	},
};
export function getAmounts(
	settings: Settings,
	abParticipations: Participations,
	countryGroupId: CountryGroupId,
): SelectedAmountsAndMetadata {
	if (!settings.amounts) {
		return {
			amountsValues: FALLBACK_AMOUNTS[countryGroupId],
			hideChooseYourAmount: false,
		};
	}

	const {
		test,
		control,
		hideChooseYourAmount: controlHideChooseYourAmounts,
	} = settings.amounts[countryGroupId];

	if (!test) {
		return {
			amountsValues: control,
			hideChooseYourAmount: controlHideChooseYourAmounts ?? false,
		};
	}

	const variantName = abParticipations[test.name];
	const variant = test.variants.find((v) => v.name === variantName);

	if (!variant) {
		return {
			amountsValues: control,
			hideChooseYourAmount: controlHideChooseYourAmounts ?? false,
		};
	}

	return {
		amountsValues: variant.amounts,
		hideChooseYourAmount: variant.hideChooseYourAmount ?? false,
	};
}
