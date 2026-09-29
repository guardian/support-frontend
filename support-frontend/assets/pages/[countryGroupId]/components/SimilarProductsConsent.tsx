import { type SerializedStyles } from '@emotion/react';
import { Checkbox } from '@guardian/source/react-components';
import type { CountryCode } from '@modules/internationalisation/country';
import { useState } from 'react';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';

export const CONSENT_ID = 'similar-products-consent-checkbox';

export default function SimilarProductsConsent({
	countryId,
	cssOverrides,
}: {
	countryId: CountryCode;
	cssOverrides?: SerializedStyles;
}) {
	const [consentValue, setConsentValue] = useState(true);
	const showCheckbox = countryId !== 'US';
	return (
		<div css={showCheckbox && cssOverrides}>
			<input
				type="hidden"
				name={CONSENT_ID}
				value={consentValue.toString()}
				data-testid="consentValue"
			/>
			{showCheckbox && (
				<Checkbox
					name="consentCheckbox"
					label="Receive information on our products and ways to support and enjoy our journalism. Untick to opt out."
					defaultChecked
					onClick={(event) => {
						const checked = event.currentTarget.checked;
						setConsentValue(checked);
						trackComponentClick(CONSENT_ID, checked.toString());
					}}
				/>
			)}
		</div>
	);
}
