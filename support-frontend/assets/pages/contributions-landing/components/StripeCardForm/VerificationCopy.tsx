import { useEffect } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { trackRecaptchaVerificationWarning } from './helpers/tracking';

interface VerificationCopyProps {
	countryGroupId: CountryGroupId;
	contributionType: ContributionType;
}

export function VerificationCopy({
	countryGroupId,
	contributionType,
}: VerificationCopyProps): JSX.Element {
	useEffect(() => {
		trackRecaptchaVerificationWarning(countryGroupId, contributionType);
	}, []);

	return (
		<div className="form__error">
			{' '}
			{"Please tick to verify you're a human"}{' '}
		</div>
	);
}
