import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';

export type RegularContribType = Exclude<ContributionType, 'ONE_OFF'>;

const benefitsThresholdsByCountryGroup: Record<
	CountryGroupId,
	Record<RegularContribType, number>
> = {
	GBPCountries: {
		MONTHLY: 10,
		ANNUAL: 95,
	},
	UnitedStates: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
	EURCountries: {
		MONTHLY: 10,
		ANNUAL: 95,
	},
	International: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
	AUDCountries: {
		MONTHLY: 17,
		ANNUAL: 160,
	},
	NZDCountries: {
		MONTHLY: 17,
		ANNUAL: 160,
	},
	Canada: {
		MONTHLY: 13,
		ANNUAL: 120,
	},
};

function isNotOneOff(
	contributionType: ContributionType,
): contributionType is RegularContribType {
	return contributionType !== 'ONE_OFF';
}

function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): number | undefined {
	if (isNotOneOff(contributionType)) {
		return benefitsThresholdsByCountryGroup[countryGroupId][contributionType];
	}
}

function getContribFrequency(
	contributionType: ContributionType,
): string | null {
	switch (contributionType) {
		case 'MONTHLY':
			return 'per month';
		case 'ANNUAL':
			return 'per year';
		default:
			return null;
	}
}

function priceWithGlyph(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): string {
	const currencyGlyph = glyph(detect(countryGroupId));

	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? '';

	return `${currencyGlyph}${thresholdPrice}`;
}

function getBtnThresholdCopy(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): string {
	const price = priceWithGlyph(countryGroupId, contributionType);
	const frequency = getContribFrequency(contributionType) ?? '';

	return `Change to ${price} ${frequency}`;
}

function shouldShowBenefitsMessaging(
	contributionType: ContributionType,
	selectedAmounts: SelectedAmounts,
	otherAmounts: OtherAmounts,
	countryGroupId: CountryGroupId,
): boolean {
	if (!isNotOneOff(contributionType)) {
		return false;
	}

	const benefitsThreshold =
		benefitsThresholdsByCountryGroup[countryGroupId][contributionType];

	if (selectedAmounts[contributionType] === 'other') {
		const otherAmount = otherAmounts[contributionType].amount;
		return otherAmount ? parseInt(otherAmount) >= benefitsThreshold : false;
	}

	return selectedAmounts[contributionType] >= benefitsThreshold;
}

function shouldShowBenefitsThankYouText(
	countryId: string,
	amount: number,
	contributionType: ContributionType,
): boolean {
	const maybeCountryGroup = fromCountry(countryId);

	const isNotOneOffContrib = isNotOneOff(contributionType);

	if (maybeCountryGroup && isNotOneOffContrib) {
		return (
			amount >=
			benefitsThresholdsByCountryGroup[maybeCountryGroup][contributionType]
		);
	}

	return false;
}

export {
	benefitsThresholdsByCountryGroup,
	shouldShowBenefitsMessaging,
	getThresholdPrice,
	getContribFrequency,
	priceWithGlyph,
	getBtnThresholdCopy,
	shouldShowBenefitsThankYouText as showBenefitsThankYouText,
};
