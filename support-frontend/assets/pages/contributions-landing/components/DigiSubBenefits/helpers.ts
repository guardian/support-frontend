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
		MONTHLY: 12,
		ANNUAL: 119,
	},
	UnitedStates: {
		MONTHLY: 20,
		ANNUAL: 199,
	},
	EURCountries: {
		MONTHLY: 15,
		ANNUAL: 149,
	},
	International: {
		MONTHLY: 20,
		ANNUAL: 199,
	},
	AUDCountries: {
		MONTHLY: 22,
		ANNUAL: 215,
	},
	NZDCountries: {
		MONTHLY: 24,
		ANNUAL: 235,
	},
	Canada: {
		MONTHLY: 22,
		ANNUAL: 219,
	},
};

function isOneOff(
	contributionType: ContributionType,
): contributionType is RegularContribType {
	return contributionType == 'ONE_OFF';
}

function isNotOneOff(
	contributionType: ContributionType,
): contributionType is RegularContribType {
	return !isOneOff(contributionType);
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
