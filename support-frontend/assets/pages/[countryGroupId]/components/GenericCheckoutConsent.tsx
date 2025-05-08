import { Checkbox } from '@guardian/source/react-components';
import { useState } from 'react';
import { trackComponentClick } from '../../../helpers/tracking/behaviour';

export const productConsents = {
	similarProductsConsent: 'similar-products-consent-checkbox',
	oneTimeContributionConsent: 'one-time-contribution-consent-checkbox',
} satisfies Record<string, string>;

export type ProductConsent = keyof typeof productConsents;

export default function SoftOptInCheckoutConsent({
	productConsent,
}: {
	productConsent: ProductConsent;
}) {
	const [consentValue, setConsentValue] = useState(true);
	return (
		<>
			<input
				type="hidden"
				name={productConsent}
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
					trackComponentClick(
						productConsents[productConsent],
						checked.toString(),
					);
				}}
			/>
		</>
	);
}
