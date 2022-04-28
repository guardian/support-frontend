import type {
	ContributionType,
	OtherAmounts,
	SelectedAmounts,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { fromCountry } from 'helpers/internationalisation/countryGroup';
import { detect, glyph } from 'helpers/internationalisation/currency';

type CountryGroupsNotAUD = Exclude<CountryGroupId, 'AUDCountries'>;
export type RegularContribType = Exclude<ContributionType, 'ONE_OFF'>;

const benefitsThresholdsByCountryGroup: Record<
	CountryGroupsNotAUD,
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
	NZDCountries: {
		MONTHLY: 24,
		ANNUAL: 235,
	},
	Canada: {
		MONTHLY: 22,
		ANNUAL: 219,
	},
};

function isNotAustralia(
	countryGroupId: CountryGroupId,
): countryGroupId is CountryGroupsNotAUD {
	return countryGroupId !== 'AUDCountries';
}

function isNotOneOff(
	contributionType: ContributionType,
): contributionType is RegularContribType {
	return contributionType !== 'ONE_OFF';
}

function getThresholdPrice(
	countryGroupId: CountryGroupId,
	contributionType: ContributionType,
): number | undefined {
	if (isNotAustralia(countryGroupId) && isNotOneOff(contributionType)) {
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
	if (!isNotAustralia(countryGroupId) || !isNotOneOff(contributionType)) {
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
	const countryGroupNotAUD =
		maybeCountryGroup && isNotAustralia(maybeCountryGroup);
	const isNotOneOffContrib = isNotOneOff(contributionType);

	if (maybeCountryGroup && countryGroupNotAUD && isNotOneOffContrib) {
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
