import { Checkbox } from '@guardian/source/react-components';
import { useState } from 'react';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';

export const CONSENT_ID = 'similar-products-consent-checkbox';

export default function SimilarProductsConsent() {
	const [consentValue, setConsentValue] = useState(true);
	return (
		<>
			<input
				type="hidden"
				name={CONSENT_ID}
				value={consentValue.toString()}
				data-testid="consentValue"
			/>
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
		</>
	);
}
